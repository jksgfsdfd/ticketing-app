import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// while displaying the orderhistory we would also like to show the title
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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

ticketSchema.set("versionKey", "version");
ticketSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };
  done();
});

const Ticket = mongoose.model<TicketDoc, TicketModel>("Tickets", ticketSchema);

export { Ticket };
