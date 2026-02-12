import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = resolve(__dirname, "../data/db.json");

const DEFAULT_DB = {
  users: [],
};

const parseDb = (content) => {
  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.users)) {
      return { ...DEFAULT_DB };
    }
    return parsed;
  } catch {
    return { ...DEFAULT_DB };
  }
};

const ensureDb = async () => {
  try {
    await readFile(DB_PATH, "utf-8");
  } catch {
    await mkdir(resolve(__dirname, "../data"), { recursive: true });
    await writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
};

export const readDb = async () => {
  await ensureDb();
  const content = await readFile(DB_PATH, "utf-8");
  return parseDb(content);
};

export const writeDb = async (nextDb) => {
  await ensureDb();
  await writeFile(DB_PATH, JSON.stringify(nextDb, null, 2));
};

let mutationQueue = Promise.resolve();

export const mutateDb = async (mutator) => {
  const runMutation = async () => {
    const db = await readDb();
    const result = await mutator(db);
    await writeDb(db);
    return result;
  };

  const nextMutation = mutationQueue.then(runMutation, runMutation);
  mutationQueue = nextMutation.catch(() => undefined);

  return nextMutation;
};
