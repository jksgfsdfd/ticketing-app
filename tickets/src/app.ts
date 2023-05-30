import express from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import cors from "cors";
import { errorHandler } from "@maanas.backend/commons";
import { indexTicketRouter } from "./routes/index";
import { newRouter } from "./routes/new";
import { showRouter } from "./routes/show";
import { editRouter } from "./routes/edit";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(indexTicketRouter);
app.use(newRouter);
app.use(showRouter);
app.use(editRouter);
app.use(errorHandler);

export { app };
