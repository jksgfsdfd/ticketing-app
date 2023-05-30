import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  await signin();

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
  const rawSessionCookie = response.get("Set-Cookie")[0];
  const base64EncodedJWTObject = rawSessionCookie.split(";")[0].slice(8);
  expect(base64EncodedJWTObject).toEqual("");
});
