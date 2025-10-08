import { PrismaClient } from "@prisma/client";
import { exerciseData } from "../lib/exerciseData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // First, let's clean existing data
  await prisma.exercise.deleteMany();

  // Create exercises using shared data
  for (const exercise of exerciseData) {
    const existingExercise = await prisma.exercise.findFirst({
      where: { name: exercise.name },
    });

    if (!existingExercise) {
      await prisma.exercise.create({
        data: exercise,
      });
    }
  }

  console.log("✅ Database seeded with sample exercises");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
