import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";

// 1. Create a "require" function that acts like we are in Old Node.js
const require = createRequire(import.meta.url);

// 2. Load the library. Because we pinned version 1.1.1,
// we KNOW this will be a function, not a weird object.
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
    fs.writeFile("resume.txt", data.text);

    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
