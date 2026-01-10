import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("  Deleting all resumes...");

  const result = await prisma.resume.deleteMany({});

  console.log(`  Deleted ${result.count} resumes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
