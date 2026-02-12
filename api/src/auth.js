import jwt from "jsonwebtoken";
import { readDb } from "./db.js";

const DEFAULT_JWT_SECRET = "dev-jwt-secret-change-me";
const JWT_SECRET = globalThis.process?.env?.JWT_SECRET || DEFAULT_JWT_SECRET;
const JWT_EXPIRES_IN = "7d";
const NODE_ENV = globalThis.process?.env?.NODE_ENV || "development";

if (!globalThis.process?.env?.JWT_SECRET) {
  const message =
    "JWT_SECRET nao definido. Configure JWT_SECRET em producao para seguranca.";

  if (NODE_ENV === "production") {
    throw new Error(message);
  }

  console.warn(message);
}

export const signToken = (userId) => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authMiddleware = async (request, response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    return response
      .status(401)
      .json({ message: "Missing authorization token" });
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return response
      .status(401)
      .json({ message: "Missing authorization token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;
    const db = await readDb();
    const user = db.users.find((item) => item.id === userId);

    if (!user) {
      return response.status(401).json({ message: "Invalid token" });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid token" });
  }
};
