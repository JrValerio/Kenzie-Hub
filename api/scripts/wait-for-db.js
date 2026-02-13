import "dotenv/config";
import waitOn from "wait-on";

const DATABASE_URL = globalThis.process?.env?.DATABASE_URL;
const WAIT_TIMEOUT_MS = Number(globalThis.process?.env?.DB_WAIT_TIMEOUT_MS || 60000);

if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL nao definido. Configure DATABASE_URL antes de iniciar a API em producao."
  );
  globalThis.process.exit(1);
}

let host = "";
let port = 5432;

try {
  const dbUrl = new URL(DATABASE_URL);
  host = dbUrl.hostname;
  port = Number(dbUrl.port || 5432);
} catch {
  console.error("DATABASE_URL invalido. Verifique o formato da URL de conexao.");
  globalThis.process.exit(1);
}

const resource = `tcp:${host}:${port}`;
console.log(`Waiting for database at ${resource} (timeout: ${WAIT_TIMEOUT_MS}ms)...`);

try {
  await waitOn({
    resources: [resource],
    timeout: WAIT_TIMEOUT_MS,
    interval: 1000,
    tcpTimeout: 10000,
    log: false,
    verbose: false,
  });
  console.log("Database is reachable.");
} catch {
  console.error(
    `Database did not become reachable in ${WAIT_TIMEOUT_MS}ms (${resource}).`
  );
  globalThis.process.exit(1);
}
