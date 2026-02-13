import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { Prisma } from "@prisma/client";
import { authMiddleware, signToken } from "./auth.js";
import { TECH_STATUS_OPTIONS } from "./constants.js";
import { prisma } from "./prisma.js";

const app = express();
const PORT = Number(globalThis.process?.env?.PORT || 3333);
const HOST = globalThis.process?.env?.HOST || "0.0.0.0";
const NODE_ENV = globalThis.process?.env?.NODE_ENV || "development";
const FRONTEND_URL = globalThis.process?.env?.FRONTEND_URL || "";
const allowedOrigins = FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (NODE_ENV === "production" && !allowedOrigins.length) {
  throw new Error(
    "FRONTEND_URL nao definido. Configure FRONTEND_URL em producao para restringir CORS."
  );
}

if (!allowedOrigins.length) {
  console.warn(
    "FRONTEND_URL nao definido. CORS liberado para qualquer origem em desenvolvimento."
  );
}

app.use(
  cors(
    allowedOrigins.length
      ? {
          origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
              return;
            }

            callback(new Error("Origin not allowed by CORS"));
          },
        }
      : {}
  )
);
app.use(express.json());

const sanitizeTech = (tech) => {
  return {
    id: tech.id,
    title: tech.title,
    status: tech.status,
    created_at: tech.createdAt,
    updated_at: tech.updatedAt,
  };
};

const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    contact: user.contact,
    course_module: user.courseModule,
    techs: Array.isArray(user.techs) ? user.techs.map(sanitizeTech) : [],
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
};

const isEmailValid = (email) => {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
};

const decodeMojibake = (value) => {
  if (/[ÃƒÃ‚]/.test(value)) {
    try {
      // Minimal compatibility fix for mis-encoded legacy strings.
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
  }

  return value;
};

const normalizeText = (value) => {
  return decodeMojibake(String(value || ""))
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const normalizeTechStatus = (status) => {
  const normalizedInput = normalizeText(status);

  return (
    TECH_STATUS_OPTIONS.find((option) => normalizeText(option) === normalizedInput) ||
    null
  );
};

const isUniqueConstraintError = (error) => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
};

app.get("/health", (_request, response) => {
  return response.status(200).json({ status: "ok" });
});

app.post("/users", async (request, response) => {
  const { name, email, password, bio, contact, course_module } = request.body;

  if (!name || !email || !password || !bio || !contact || !course_module) {
    return response.status(400).json({ message: "Missing required fields" });
  }

  if (!isEmailValid(email)) {
    return response.status(400).json({ message: "Invalid email" });
  }

  if (password.length < 8) {
    return response.status(400).json({ message: "Password is too short" });
  }

  try {
    const alreadyExists = await prisma.user.findUnique({ where: { email } });

    if (alreadyExists) {
      return response.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        passwordHash,
        bio: String(bio),
        contact: String(contact),
        courseModule: String(course_module),
      },
      include: { techs: true },
    });

    return response.status(201).json(sanitizeUser(user));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return response.status(409).json({ message: "Email already exists" });
    }

    return response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/sessions", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "Missing credentials" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
      include: { techs: true },
    });

    if (!user) {
      return response
        .status(401)
        .json({ message: "Incorrect email/password combination" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ message: "Incorrect email/password combination" });
    }

    const token = signToken(user.id);
    return response.status(200).json({ user: sanitizeUser(user), token });
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", authMiddleware, async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { techs: true },
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(200).json(sanitizeUser(user));
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/users/techs", authMiddleware, async (request, response) => {
  const { title, status } = request.body;

  if (!title || !status) {
    return response
      .status(400)
      .json({ message: "Title and status are required" });
  }

  const normalizedStatus = normalizeTechStatus(status);

  if (!normalizedStatus) {
    return response.status(400).json({
      message: `Invalid status. Allowed values: ${TECH_STATUS_OPTIONS.join(
        ", "
      )}`,
    });
  }

  try {
    const duplicatedTech = await prisma.tech.findFirst({
      where: {
        userId: request.user.id,
        title: { equals: String(title), mode: "insensitive" },
      },
      select: { id: true },
    });

    if (duplicatedTech) {
      return response
        .status(400)
        .json({ message: "Technology already registered" });
    }

    const tech = await prisma.tech.create({
      data: {
        title: String(title),
        status: normalizedStatus,
        userId: request.user.id,
      },
    });

    return response.status(201).json(sanitizeTech(tech));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return response
        .status(400)
        .json({ message: "Technology already registered" });
    }

    return response.status(500).json({ message: "Internal server error" });
  }
});

app.put("/users/techs/:techId", authMiddleware, async (request, response) => {
  const { techId } = request.params;
  const { title, status } = request.body;

  if (!status && !title) {
    return response
      .status(400)
      .json({ message: "At least one field must be provided" });
  }

  const normalizedStatus = status ? normalizeTechStatus(status) : null;

  if (status && !normalizedStatus) {
    return response.status(400).json({
      message: `Invalid status. Allowed values: ${TECH_STATUS_OPTIONS.join(
        ", "
      )}`,
    });
  }

  try {
    const currentTech = await prisma.tech.findFirst({
      where: { id: techId, userId: request.user.id },
    });

    if (!currentTech) {
      return response.status(404).json({ message: "Technology not found" });
    }

    const nextTitle = title ? String(title) : undefined;
    const isChangingTitle =
      typeof nextTitle === "string" &&
      nextTitle.toLowerCase() !== currentTech.title.toLowerCase();

    if (isChangingTitle) {
      const duplicatedTech = await prisma.tech.findFirst({
        where: {
          userId: request.user.id,
          id: { not: currentTech.id },
          title: { equals: nextTitle, mode: "insensitive" },
        },
        select: { id: true },
      });

      if (duplicatedTech) {
        return response
          .status(400)
          .json({ message: "Technology already registered" });
      }
    }

    const updatedTech = await prisma.tech.update({
      where: { id: techId },
      data: {
        ...(typeof nextTitle === "string" ? { title: nextTitle } : {}),
        ...(normalizedStatus ? { status: normalizedStatus } : {}),
      },
    });

    return response.status(200).json(sanitizeTech(updatedTech));
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return response
        .status(400)
        .json({ message: "Technology already registered" });
    }

    return response.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/users/techs/:techId", authMiddleware, async (request, response) => {
  const { techId } = request.params;

  try {
    const tech = await prisma.tech.findFirst({
      where: { id: techId, userId: request.user.id },
      select: { id: true },
    });

    if (!tech) {
      return response.status(404).json({ message: "Technology not found" });
    }

    await prisma.tech.delete({ where: { id: techId } });
    return response.status(204).send();
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

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
