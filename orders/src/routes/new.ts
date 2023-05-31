import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import {
  currentUser,
  checkAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@maanas.backend/commons";
import { natsWrapper } from "../natsWrapper";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";

const router = express.Router();

router.post(
  "/api/orders/new",
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((inputTicketId: string) => {
        return mongoose.Types.ObjectId.isValid(inputTicketId);
      })
      .withMessage("Invalid ticketId"),
  ],
  validateRequest,
  currentUser,
  checkAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved", ticketId);
    }

    const newOrder = Order.build({
      ticket: ticket,
      userId: userId,
    });

    await newOrder.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder._id,
      expiresAt: newOrder.expiresAt.toISOString(),
      userId: newOrder.userId,
      ticket: {
        id: newOrder.ticket.id,
      },
    });

    res.status(201).json(ticket.toJSON());
  }
);

export { router as newRouter };
