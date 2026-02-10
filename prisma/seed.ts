import { PrismaClient } from "@prisma/client";
// Local definition to avoid import issues with tsx/esm
interface AnalysisResult {
  overallScore: number;
  estimatedSalary: string;
  extractedSkills: string[];
  ATS: FeedbackItem;
  toneAndStyle: FeedbackItem;
  content: FeedbackItem;
  structure: FeedbackItem;
  skills: FeedbackItem;
}

interface FeedbackItem {
  score: number;
  tips: {
    type: "good" | "improve";
    tip: string;
    explanation?: string | null;
  }[];
}

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Cleanup existing data
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned up existing data");

  // 2. Create a test user
  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      // In a real app, hash this! For dev/demo, simple string is fine if auth allows it or logic handles it.
      // Assuming existing auth checks passwordHash vs string or bcrypt.
      // If your app strictly requires bcrypt, we might need a hash here.
      // For now, using a placeholder string that matches what a simple dev setup might expect or "password123".
      passwordHash: "$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN",
      name: "Demo User",
    },
  });
  console.log(`👤 Created user: ${user.email}`);

  // 3. Prepare sample analysis data
  const sampleAnalysis: AnalysisResult = {
    overallScore: 85,
    estimatedSalary: "$120k - $140k",
    extractedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "Prisma",
      "Tailwind CSS",
    ],
    ATS: {
      score: 90,
      tips: [
        { type: "good", tip: "Standard formatting used." },
        {
          type: "improve",
          tip: "Add more keywords related to 'Senior Architect'.",
        },
      ],
    },
    toneAndStyle: {
      score: 80,
      tips: [{ type: "good", tip: "Professional tone throughout." }],
    },
    content: {
      score: 85,
      tips: [
        {
          type: "improve",
          tip: "Quantify impact in 'Project X' bullet points.",
        },
      ],
    },
    structure: {
      score: 95,
      tips: [{ type: "good", tip: "Clear headers and logical flow." }],
    },
    skills: {
      score: 75,
      tips: [
        {
          type: "improve",
          tip: "List 'Docker' if you have experience with it.",
        },
      ],
    },
  };

  // 4. Create sample resumes
  await prisma.resume.create({
    data: {
      userId: user.id,
      name: "Software Engineer Resume_Final.pdf",
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      fileUrl: "https://example.com/resume.pdf", // Mock URL
      analysisJson: JSON.stringify(sampleAnalysis),
    },
  });

  await prisma.resume.create({
    data: {
      userId: user.id,
      name: "Old Resume 2024.pdf",
      title: "Frontend Developer",
      company: "Startup Inc",
      fileUrl: "https://example.com/old_resume.pdf",
      analysisJson: JSON.stringify({
        ...sampleAnalysis,
        overallScore: 65,
        estimatedSalary: "$90k - $110k",
      }),
    },
  });

  console.log("📄 Created 2 sample resumes");
  console.log("✅ Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
