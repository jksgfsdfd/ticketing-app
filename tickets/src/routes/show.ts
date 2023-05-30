import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@maanas.backend/commons";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json(ticket.toJSON());
});

export { router as showRouter };
