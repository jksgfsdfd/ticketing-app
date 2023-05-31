import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import {
  currentUser,
  checkAuth,
  validateRequest,
} from "@maanas.backend/commons";
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.post(
  "/api/tickets/new",
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
    console.log("got request inside function");
    try {
      const { id: userId } = req.currentUser!;
      const { title, price, description } = req.body;
      const buildParams: any = {
        title,
        price,
        userId,
      };
      if (description) {
        buildParams.description = description;
      }
      const ticket = Ticket.build(buildParams);
      await ticket.save();
      console.log("ticket saved to db");
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket._id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });
      res.status(201).json(ticket.toJSON());
    } catch (err) {
      console.error(err);
      throw new Error("some error");
    }
  }
);

export { router as newRouter };
