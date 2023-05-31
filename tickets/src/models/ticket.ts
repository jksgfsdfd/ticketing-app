import mongoose from "mongoose";

// doc refers to a single document whereas model refers to the entire db.

interface TicketAttrs {
  title: string;
  description?: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  description?: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
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
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

// how are we able to use User inside this function if User is declared according to userSchema
ticketSchema.statics.build = (ticketInitData: TicketAttrs) => {
  return new Ticket(ticketInitData);
};

ticketSchema.set("versionKey", "version");
ticketSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version"),
  };
  this.increment();
  done();
});

const Ticket = mongoose.model<TicketDoc, TicketModel>("Tickets", ticketSchema);

export { Ticket };
