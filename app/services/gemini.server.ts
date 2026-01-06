import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// 1. Initialize Gemini

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// 1. Configure the model to ENFORCE JSON
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

// 2. Define the exact shape of data we want back

// export interface FeedbackItem {
//   score: number;
//   tips: Array<{
//     type: "good" | "improve";
//     tip: string;
//     explanation?: string;
//   }>;
// }

export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;

const FeedbackItemSchema = z.object({
  score: z.number().min(0).max(100),
  tips: z.array(
    z.object({
      type: z.enum(["good", "improve"]), // Strict check: only these two strings allowed
      tip: z.string(),
      explanation: z.string().optional(),
    })
  ),
});

const AnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  estimatedSalary: z.string(), // We keep string because ranges ("$80k-90k") are text
  extractedSkills: z.array(z.string()),
  ATS: FeedbackItemSchema,
  toneAndStyle: FeedbackItemSchema,
  content: FeedbackItemSchema,
  structure: FeedbackItemSchema,
  skills: FeedbackItemSchema,
});

// 3. Type inference
export type AnalysisResult = z.infer<typeof AnalysisSchema>;
// export interface AnalysisResult {
//   overallScore: number;
//   estimatedSalary: string;
//   extractedSkills: string[];
//   ATS: FeedbackItem;
//   toneAndStyle: FeedbackItem;
//   content: FeedbackItem;
//   structure: FeedbackItem;
//   skills: FeedbackItem;
// }

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
      "estimatedSalary": string (e.g. "$80k - $100k" based on skills/exp),
      "extractedSkills": string[] (list of top TECHNICAL and SOFT skills found),
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
    6. "estimatedSalary" should be a realistic range based on the resume's experience level and the target job title in the US market.
    7. "extractedSkills" should be a simple list of key skills found in the text.
  `;

  try {
    // 4. Call Gemini
    const result = await model.generateContent(prompt);
    // const response = result.response;
    // const text = response.text();
    // const cleanedText = text
    //   .replace(/```json/g, "")
    //   .replace(/```/g, "")
    //   .trim();
    // const jsonResponse = JSON.parse(cleanedText) as AnalysisResult;
    // 3. No Regex needed anymore!
    // The API guarantees a clean JSON string because of 'application/json' config.

    const rawJson = JSON.parse(result.response.text()) as AnalysisResult;

    //4. Validate the JSON
    // If it doesn't match our schema, throw an error
    const validatedData = AnalysisSchema.parse(rawJson);

    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Zod Validation Error:",
        JSON.stringify(error.errors, null, 2)
      );
      throw new Error(
        `Resume analysis failed validation: ${error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
      );
    }
    console.error("Error analyzing resume with Gemini:", error);
    throw new Error(`Failed to analyze resume: ${error}`);
  }
}
