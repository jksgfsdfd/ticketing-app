import { app } from "../../app";
import request from "supertest";
import { natsWrapper } from "../../natsWrapper";

it("publishes an event", async () => {
  const title = "asldkfj";
  const cookie = await global.signin();
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
