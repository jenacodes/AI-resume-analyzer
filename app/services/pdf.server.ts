import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";

// 1. Create a "require" function that acts like we are in Old Node.js
const require = createRequire(import.meta.url);

// 2. Load the library. Because i pinned version 1.1.1,
// this will be a function, not a weird object anymore
const pdf = require("pdf-parse");

export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const relativePath = filePath.startsWith("/")
      ? filePath.slice(1)
      : filePath;
    const absolutePath = path.join(process.cwd(), "public", relativePath);

    const dataBuffer = await fs.readFile(absolutePath);

    // 3. Use the library
    const data = await pdf(dataBuffer);

    // Check if text exists and isn't just whitespace sending to the AI
    if (!data.text || data.text.trim().length === 0) {
      //Throw this error to the frontend
      throw new Error(
        "This PDF contains no readable text. It might be a scanned image."
      );
    }
    // fs.writeFile("resume.txt", data.text);
    return data.text;
  } catch (error: any) {
    console.error("Error extracting text from PDF:", error);
    // so the frontend gets the specific message.
    if (error.message.includes("scanned image")) {
      throw error;
    }
    console.log(`error: ${error}`);
    throw new Error("Failed to extract text from PDF");
  }
}
