import request from "supertest";
import { app } from "../../app";
import jwt, { JwtPayload } from "jsonwebtoken";

it("Returns 400 for an invalid email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test123", password: "123455" })
    .expect(400);
});

it("Returns 400 for an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123" })
    .expect(400);
});

it("Returns 400 for an existing email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123453" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234543" })
    .expect(400);
});

it("Returns 201 when a user is created successfully", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123455" })
    .expect(201);
});

it("Sets jwt key as cookie on successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123455" });

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("Returns back the user id and email on successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123455" });

  expect(response.body.email).toEqual("test@test.com");
  expect(response.body.id).toBeDefined();
});

it("The jwt key contains userId,email and expiry", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "123455" });

  const rawSessionCookie = response.get("Set-Cookie")[0];
  const base64EncodedJWTObject = rawSessionCookie.split(";")[0].slice(8);
  const base64DecodedJWTObject = Buffer.from(
    base64EncodedJWTObject,
    "base64"
  ).toString("utf-8");
  const jwtKey = JSON.parse(base64DecodedJWTObject).jwt;
  const decodedData = jwt.decode(jwtKey) as JwtPayload;
  expect(decodedData.email).toEqual("test@test.com");
  expect(decodedData.id).toBeDefined();
  expect(decodedData.exp! - decodedData.iat!).toEqual(900);
});
