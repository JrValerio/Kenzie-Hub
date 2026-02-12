import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/prisma.js";

const DEMO_EMAIL = "demo@kenziehub.dev";

const run = async () => {
  const existingUser = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });

  if (existingUser) {
    console.log("Seed skipped: demo user already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash("Demo@1234", 10);

  await prisma.user.create({
    data: {
      name: "Demo User",
      email: DEMO_EMAIL,
      passwordHash,
      bio: "Conta demo seed",
      contact: "Atibaia/SP",
      courseModule: "Primeiro Modulo",
      techs: {
        create: [
          { title: "React", status: "Intermediario" },
          { title: "Node.js", status: "Iniciante" },
        ],
      },
    },
  });

  console.log("Seed completed.");
};

run()
  .catch((error) => {
    console.error("Seed failed:", error);
    globalThis.process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
