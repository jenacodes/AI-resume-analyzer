import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { performResumeAnalysis, createPendingResume } from "./scan.server";

// 1. Mock External Dependencies so we don't hit real DB or APIs
vi.mock("~/db.server", () => ({
  db: {
    resume: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("./gemini.server", () => ({
  analyzeResume: vi.fn(),
}));

vi.mock("./pdf.server", () => ({
  extractTextFromBuffer: vi.fn(),
}));

// Import the mocked objects to define their behavior in tests
import { db } from "~/db.server";
import { analyzeResume } from "./gemini.server";
import { extractTextFromBuffer } from "./pdf.server";

describe("Concurrent Resume Processing", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock global fetch for PDF download
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
      }),
    ) as any;
  });

  it("should handle 3 concurrent users creating and analyzing resumes", async () => {
    // --- Setup Mocks ---

    // 1. DB Create Mock (Simulate successful insert)
    (db.resume.create as any).mockImplementation((args: any) => ({
      id: `resume-${Math.random()}`, // Return a fake ID
      ...args.data,
    }));

    // 2. DB FindUnique Mock (Return the resume record)
    (db.resume.findUnique as any).mockImplementation((args: any) => ({
      id: args.where.id,
      fileUrl: "https://utfs.io/f/test-resume.pdf",
      title: "Software Engineer",
      status: "PENDING",
    }));

    // 3. DB Update Mock (Simulate updating status)
    (db.resume.update as any).mockResolvedValue({});

    // 4. PDF Text Extraction Mock
    (extractTextFromBuffer as any).mockResolvedValue("Extracted Resume Text");

    // 5. Gemini Mock
    (analyzeResume as any).mockResolvedValue({
      overallScore: 85,
      extractedSkills: ["React"],
    });

    // --- The Test: Simulate 3 Users ---

    const users = ["User1", "User2", "User3"];

    console.log("🚀 Starting concurrent simulation for 3 users...");

    // execute 3 flows in parallel
    const results = await Promise.all(
      users.map(async (userId, index) => {
        // Step 1: User uploads (Create DB Record)
        const fileUrl = "https://utfs.io/f/cv.pdf";
        const createdResume = await createPendingResume(
          userId,
          fileUrl,
          "My Resume.pdf",
          "Dev",
        );

        // Step 2: Trigger Analysis (Background Process)
        // We pass the ID we just "created"
        const result = await performResumeAnalysis(createdResume.id);

        return { userId, success: result.success, resumeId: createdResume.id };
      }),
    );

    // --- Assertions ---

    console.log("✅ Simulation complete. Checking results...");

    // 1. All 3 should succeed
    expect(results).toHaveLength(3);
    results.forEach((r) => expect(r.success).toBe(true));

    // 2. DB Create should have been called 3 times
    expect(db.resume.create).toHaveBeenCalledTimes(3);

    // 3. DB FindUnique should have been called 3 times (once per analysis)
    expect(db.resume.findUnique).toHaveBeenCalledTimes(3);

    // 4. DB Update should have been called 6 times (3 for PROCESSING, 3 for COMPLETED)
    // We expect each flow to trigger: status="PROCESSING" -> status="COMPLETED"
    expect(db.resume.update).toHaveBeenCalledTimes(6);

    // 5. External Services (PDF & Gemini) should have been called 3 times each
    expect(extractTextFromBuffer).toHaveBeenCalledTimes(3);
    expect(analyzeResume).toHaveBeenCalledTimes(3);
  });
});
