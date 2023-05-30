import express, { Request, Response } from "express";
import {
  currentUser,
  checkAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@maanas.backend/commons";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/orderCancelledPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  currentUser,
  checkAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;

    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId != userId) {
      throw new NotAuthorizedError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order._id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).json(order.toJSON());
  }
);

export { router as deleteRouter };
