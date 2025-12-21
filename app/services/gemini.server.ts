import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize Gemini

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 2. Define the exact shape of data we want back

export interface AnalysisResult {
  overallScore: number;
  ATS: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
  toneAndStyle: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
  content: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
  structure: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
  skills: {
    score: number;
    tips: Array<{
      type: "good" | "improve";
      tip: string;
      explanation?: string;
    }>;
  };
}

export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
  jobDesc?: string
): Promise<AnalysisResult> {
  // 3. Construct the Prompt
  const prompt = `
    You are an expert AI Resume Analyzer and Career Coach.
    Your task is to analyze a resume for the position of "${jobTitle}".
    ${jobDesc ? `Job Description: "${jobDesc}"` : ""}

    RESUME TEXT:
    "${resumeText}"

    Analyze the resume and provide a detailed report in strict JSON format.
    The JSON must exactly match this structure:
    {
      "overallScore": number (0-100),
      "ATS": { "score": number, "tips": [{"type": "good"|"improve", "tip": string, "explanation": string}] },
      "toneAndStyle": { "score": number, "tips": [...] },
      "content": { "score": number, "tips": [...] },
      "structure": { "score": number, "tips": [...] },
      "skills": { "score": number, "tips": [...] }
    }

    CRITICAL INSTRUCTIONS:
    1. Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json).
    2. Be critical but constructive.
    3. "ATS" checks for keywords and formatting issues.
    4. "Content" checks for impact, metrics, and clarity.
    5. "Structure" checks for layout, sections, and readability.
  `;

  try {
    // 4. Call Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Clean and Parse JSON
    // Sometimes Gemini wraps JSON in markdown code blocks, so we clean it.
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const jsonResponse = JSON.parse(cleanedText) as AnalysisResult;

    return jsonResponse;
  } catch (error) {
    console.error("Error analyzing resume with Gemini:", error);
    throw new Error(`Failed to analyze resume: ${error}`);
  }
}
