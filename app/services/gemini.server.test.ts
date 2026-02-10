import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeResume } from "./gemini.server";

// Mock the GoogleGenerativeAI library
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
  SchemaType: {
    OBJECT: "OBJECT",
    STRING: "STRING",
    NUMBER: "NUMBER",
    ARRAY: "ARRAY",
  },
}));

describe("gemini.server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-api-key";
  });

  it("should analyze a resume correctly", async () => {
    // 1. Setup the mock response
    const mockResponseData = {
      overallScore: 85,
      estimatedSalary: "$100k - $120k",
      extractedSkills: ["React", "TypeScript", "Node.js"],
      ATS: {
        score: 90,
        tips: [{ type: "good", tip: "Great keywords" }],
      },
      toneAndStyle: {
        score: 80,
        tips: [{ type: "improve", tip: "Use more action verbs" }],
      },
      content: {
        score: 85,
        tips: [{ type: "good", tip: "Clear impact statements" }],
      },
      structure: {
        score: 95,
        tips: [{ type: "good", tip: "Easy to read layout" }],
      },
      skills: {
        score: 88,
        tips: [{ type: "good", tip: "Relevant tech stack" }],
      },
    };

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(mockResponseData),
      },
    });

    // 2. Call the function
    const result = await analyzeResume(
      "Resume text content...",
      "Senior Developer",
    );

    // 3. Assertions
    expect(result).toEqual(mockResponseData);
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-2.5-flash",
      }),
    );
    expect(mockGenerateContent).toHaveBeenCalled();
  });

  it("should handle invalid JSON from Gemini", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "Invalid JSON string",
      },
    });

    await expect(
      analyzeResume("Resume content", "Job Title"),
    ).rejects.toThrow();
  });

  it("should handle Zod validation errors", async () => {
    const invalidData = {
      overallScore: 150, // Invalid: > 100
      estimatedSalary: 100000, // Invalid: should be string
      // Missing required fields
    };

    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify(invalidData),
      },
    });

    await expect(analyzeResume("Resume content", "Job Title")).rejects.toThrow(
      /validation/i,
    );
  });
});
