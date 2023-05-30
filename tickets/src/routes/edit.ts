import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import {
  currentUser,
  checkAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from "@maanas.backend/commons";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.post(
  "/api/tickets/:id",
  [
    body("title").not().isEmpty().withMessage("Title must be present"),
    body("price")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  currentUser,
  checkAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;
    const { title, price, description } = req.body;
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (userId != ticket.userId) {
      throw new NotAuthorizedError();
    }

    ticket.set({ title, price, description });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket._id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).json(ticket.toJSON());
  }
);

export { router as editRouter };
