import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// while displaying the orderhistory we would also like to show the title
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  isReserved: () => Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(ticketInitData: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

// won't it be better to just add a field of orderId containing the current active orderId?
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

ticketSchema.statics.build = (ticketInitData: TicketAttrs) => {
  const temp: any = {
    ...ticketInitData,
    _id: ticketInitData.id,
  };
  delete temp["id"];
  return new Ticket(temp);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Tickets", ticketSchema);

export { Ticket };
