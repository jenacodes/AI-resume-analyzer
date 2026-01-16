/*
  Warnings:

  - Made the column `analysisJson` on table `Resume` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Resume',
    "title" TEXT NOT NULL,
    "company" TEXT,
    "filePath" TEXT NOT NULL,
    "analysisJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resume" ("analysisJson", "company", "createdAt", "filePath", "id", "name", "title", "updatedAt", "userId") SELECT "analysisJson", "company", "createdAt", "filePath", "id", "name", "title", "updatedAt", "userId" FROM "Resume";
DROP TABLE "Resume";
ALTER TABLE "new_Resume" RENAME TO "Resume";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
