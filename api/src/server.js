import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware, signToken } from "./auth.js";
import { TECH_STATUS_OPTIONS } from "./constants.js";
import { mutateDb, readDb } from "./db.js";

const app = express();
const PORT = Number(globalThis.process?.env?.PORT || 3333);
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

const sanitizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    contact: user.contact,
    course_module: user.course_module,
    techs: user.techs || [],
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

const isEmailValid = (email) => {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
};

const decodeMojibake = (value) => {
  if (/[ÃÂ]/.test(value)) {
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
    const createdUser = await mutateDb(async (db) => {
      const alreadyExists = db.users.some((user) => user.email === email);

      if (alreadyExists) {
        return { error: "Email already exists" };
      }

      const now = new Date().toISOString();
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id: uuidv4(),
        name,
        email,
        password: passwordHash,
        bio,
        contact,
        course_module,
        techs: [],
        created_at: now,
        updated_at: now,
      };

      db.users.push(user);
      return { user };
    });

    if (createdUser.error) {
      return response.status(409).json({ message: createdUser.error });
    }

    return response.status(201).json(sanitizeUser(createdUser.user));
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/sessions", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: "Missing credentials" });
  }

  try {
    const db = await readDb();
    const user = db.users.find((item) => item.email === email);

    if (!user) {
      return response
        .status(401)
        .json({ message: "Incorrect email/password combination" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

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
  return response.status(200).json(sanitizeUser(request.user));
});

app.post("/users/techs", authMiddleware, async (request, response) => {
  const { title, status } = request.body;
  const normalizedStatus = normalizeTechStatus(status);

  if (!title || !status) {
    return response
      .status(400)
      .json({ message: "Title and status are required" });
  }

  if (!normalizedStatus) {
    return response.status(400).json({
      message: `Invalid status. Allowed values: ${TECH_STATUS_OPTIONS.join(
        ", "
      )}`,
    });
  }

  try {
    const result = await mutateDb((db) => {
      const user = db.users.find((item) => item.id === request.user.id);

      if (!user) {
        return { error: "User not found", status: 404 };
      }

      const duplicatedTech = user.techs.some(
        (tech) => tech.title.toLowerCase() === String(title).toLowerCase()
      );

      if (duplicatedTech) {
        return { error: "Technology already registered", status: 400 };
      }

      const now = new Date().toISOString();
      const tech = {
        id: uuidv4(),
        title: String(title),
        status: normalizedStatus,
        created_at: now,
        updated_at: now,
      };

      user.techs.push(tech);
      user.updated_at = now;

      return { tech };
    });

    if (result.error) {
      return response.status(result.status).json({ message: result.error });
    }

    return response.status(201).json(result.tech);
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.put("/users/techs/:techId", authMiddleware, async (request, response) => {
  const { techId } = request.params;
  const { title, status } = request.body;
  const normalizedStatus = status ? normalizeTechStatus(status) : null;

  if (!status && !title) {
    return response
      .status(400)
      .json({ message: "At least one field must be provided" });
  }

  if (status && !normalizedStatus) {
    return response.status(400).json({
      message: `Invalid status. Allowed values: ${TECH_STATUS_OPTIONS.join(
        ", "
      )}`,
    });
  }

  try {
    const result = await mutateDb((db) => {
      const user = db.users.find((item) => item.id === request.user.id);

      if (!user) {
        return { error: "User not found", status: 404 };
      }

      const tech = user.techs.find((item) => item.id === techId);

      if (!tech) {
        return { error: "Technology not found", status: 404 };
      }

      if (title && title !== tech.title) {
        const duplicatedTech = user.techs.some(
          (item) =>
            item.id !== tech.id &&
            item.title.toLowerCase() === String(title).toLowerCase()
        );

        if (duplicatedTech) {
          return { error: "Technology already registered", status: 400 };
        }

        tech.title = String(title);
      }

      if (status) {
        tech.status = normalizedStatus;
      }

      const now = new Date().toISOString();
      tech.updated_at = now;
      user.updated_at = now;

      return { tech };
    });

    if (result.error) {
      return response.status(result.status).json({ message: result.error });
    }

    return response.status(200).json(result.tech);
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/users/techs/:techId", authMiddleware, async (request, response) => {
  const { techId } = request.params;

  try {
    const result = await mutateDb((db) => {
      const user = db.users.find((item) => item.id === request.user.id);

      if (!user) {
        return { error: "User not found", status: 404 };
      }

      const index = user.techs.findIndex((item) => item.id === techId);

      if (index === -1) {
        return { error: "Technology not found", status: 404 };
      }

      user.techs.splice(index, 1);
      user.updated_at = new Date().toISOString();

      return { ok: true };
    });

    if (result.error) {
      return response.status(result.status).json({ message: result.error });
    }

    return response.status(204).send();
  } catch {
    return response.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Kenzie Hub API listening on http://localhost:${PORT}`);
});

