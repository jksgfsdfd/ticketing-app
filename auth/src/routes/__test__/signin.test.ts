// for a lot of endpoints an already created user would be necessary. hence declaring a function in global scope which would create an signin a user would eliminate redundant code

import request from "supertest";
import { app } from "../../app";

it("Returns 400 on Invalid Credentials", async () => {
  // the mode of testing with supertest would fail to persist data of the express server. Hence if we are using cache in the express server itself it would fail
  await signin();

  const email = "test@test.com";
  const password = "wrongPassword";
  await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(400);
});

it("Returns 200 on valid Credentials", async () => {
  // the mode of testing with supertest would fail to persist data of the express server. Hence if we are using cache in the express server itself it would fail
  await signin();

  const email = "test@test.com";
  const password = "password";
  await request(app)
    .post("/api/users/signin")
    .send({ email, password })
    .expect(200);
});
