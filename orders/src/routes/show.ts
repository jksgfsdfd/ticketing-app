import express, { Request, Response } from "express";
import {
  currentUser,
  checkAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@maanas.backend/commons";
import { Order } from "../models/order";

const router = express.Router();

router.get(
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

    res.status(200).json(order.toJSON());
  }
);

export { router as showRouter };
