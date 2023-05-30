import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.mock("../natsWrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "123";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const userEmail = "test@test.com";
  const jwtKey = jwt.sign(
    {
      id: userId,
      email: userEmail,
    },
    process.env.JWT_KEY!,
    {
      expiresIn: "15m",
    }
  );
  const base64Key = Buffer.from(JSON.stringify({ jwt: jwtKey })).toString(
    "base64"
  );
  return [`session=${base64Key}`];
};
