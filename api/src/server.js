import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./prisma.js";

const PORT = Number(globalThis.process?.env?.PORT || 3333);
const HOST = globalThis.process?.env?.HOST || "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Kenzie Hub API listening on http://${HOST}:${PORT}`);
});

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    globalThis.process.exit(0);
  });
};

globalThis.process.on("SIGINT", shutdown);
globalThis.process.on("SIGTERM", shutdown);
