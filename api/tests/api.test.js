import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaMock, resetPrismaMock } from "./prismaMock.js";

vi.mock("../src/prisma.js", () => ({
  prisma: prismaMock,
}));

import { app } from "../src/app.js";

const makeUserPayload = () => ({
  name: "Amaro Junior",
  email: "amaro@example.com",
  password: "Senha@123",
  bio: "Dev Fullstack",
  contact: "Atibaia/SP",
  course_module: "Primeiro Modulo",
});

const registerAndLogin = async () => {
  const userPayload = makeUserPayload();

  await request(app).post("/users").send(userPayload).expect(201);

  const loginResponse = await request(app)
    .post("/sessions")
    .send({
      email: userPayload.email,
      password: userPayload.password,
    })
    .expect(200);

  return loginResponse.body.token;
};

describe("Kenzie Hub API", () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it("registers a user and signs in", async () => {
    const userPayload = makeUserPayload();

    const registerResponse = await request(app)
      .post("/users")
      .send(userPayload)
      .expect(201);

    expect(registerResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: userPayload.email,
        name: userPayload.name,
      })
    );
    expect(registerResponse.body).not.toHaveProperty("password");

    const loginResponse = await request(app)
      .post("/sessions")
      .send({
        email: userPayload.email,
        password: userPayload.password,
      })
      .expect(200);

    expect(loginResponse.body.token).toEqual(expect.any(String));
    expect(loginResponse.body.user.email).toBe(userPayload.email);
  });

  it("executes tech CRUD flow with authenticated user", async () => {
    const token = await registerAndLogin();

    const createTechResponse = await request(app)
      .post("/users/techs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "React",
        status: "Intermediário",
      })
      .expect(201);

    expect(createTechResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: "React",
        status: "Intermediario",
      })
    );

    const techId = createTechResponse.body.id;

    const updateTechResponse = await request(app)
      .put(`/users/techs/${techId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Avançado" })
      .expect(200);

    expect(updateTechResponse.body.status).toBe("Avancado");

    const profileResponse = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profileResponse.body.techs).toHaveLength(1);
    expect(profileResponse.body.techs[0]).toEqual(
      expect.objectContaining({
        id: techId,
        status: "Avancado",
      })
    );

    await request(app)
      .delete(`/users/techs/${techId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const profileAfterDelete = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(profileAfterDelete.body.techs).toHaveLength(0);
  });

  it("rejects invalid tech status", async () => {
    const token = await registerAndLogin();

    const response = await request(app)
      .post("/users/techs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Node.js",
        status: "Especialista",
      })
      .expect(400);

    expect(response.body.message).toContain("Invalid status");
  });

  it("returns 401 on /profile without token", async () => {
    const response = await request(app).get("/profile").expect(401);

    expect(response.body).toEqual({
      message: "Missing authorization token",
    });
  });

  it("returns 401 on /users/techs without token", async () => {
    const response = await request(app).post("/users/techs").send({}).expect(401);

    expect(response.body).toEqual({
      message: "Missing authorization token",
    });
  });
});
