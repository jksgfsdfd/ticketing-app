import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

export enum OrderStatus {
  Created = "created",
  Cancelled = "cancelled",
  AwaitingPayment = "awaiting:payment",
  Complete = "complete",
}

const EXPIRATION_WINDOW_IN_S = 60;

interface OrderAttrs {
  ticket: TicketDoc;
  userId: string;
}

interface OrderDoc extends mongoose.Document {
  ticket: TicketDoc;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(orderInitData: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tickets",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (orderInitData: OrderAttrs) => {
  const temp: any = {
    ...orderInitData,
  };
  const expiration = new Date();
  temp.expiresAt = expiration.setSeconds(
    expiration.getSeconds() + EXPIRATION_WINDOW_IN_S
  );
  return new Order(temp);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Orders", orderSchema);

export { Order };
