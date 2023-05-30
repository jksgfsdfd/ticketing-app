import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import cors from "cors";
import { errorHandler } from "@maanas.backend/commons";
import { newRouter } from "./routes/new";
import { indexRouter } from "./routes";
import { deleteRouter } from "./routes/delete";
import { showRouter } from "./routes/show";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(newRouter);
app.use(indexRouter);
app.use(deleteRouter);
app.use(showRouter);

app.use(errorHandler);

export { app };
