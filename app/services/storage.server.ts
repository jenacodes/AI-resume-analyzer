import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// 1. Define where we want to save the files
// process.cwd() gets the root folder of our project
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadFile(file: File): Promise<string> {
  // 2. Ensure the directory exists
  // recursive: true means "create parent folders if they don't exist"
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // 3. Create a unique filename
  // We use a UUID so if two people upload "resume.pdf", they don't overwrite each other
  const uniqueSuffix = crypto.randomUUID();
  const filename = `${uniqueSuffix}-${file.name}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  // 4. Convert the File to a Buffer
  // A 'File' is a web object. Node.js needs a 'Buffer' to write to disk.
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 5. Write the file to the hard drive
  await fs.writeFile(filePath, buffer);

  // 6. Return the web-accessible URL
  // Since we saved it in 'public/uploads', the browser can access it at '/uploads/...'
  return `/uploads/${filename}`;
}
