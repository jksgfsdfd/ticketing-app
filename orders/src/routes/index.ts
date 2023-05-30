import express, { Request, Response } from "express";
import { currentUser, checkAuth } from "@maanas.backend/commons";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/",
  currentUser,
  checkAuth,
  async (req: Request, res: Response) => {
    const { id: userId } = req.currentUser!;

    const orders = await Order.find({ userId: userId }).populate("ticket");

    res.status(200).json(orders);
  }
);

export { router as indexRouter };
