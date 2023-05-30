import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import cors from "cors";
import { errorHandler } from "@maanas.backend/commons";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

declare global {
  namespace Express {
    interface Request {
      session?: {
        jwt: string;
      };
    }
  }
}

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.use(errorHandler);

export { app };
