// we would need this as we need to differentiate among tickets associated and non-associated with orders
import { Subjects, Listener, OrderCreatedEvent } from "@maanas.backend/commons";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      expiresAt: string;
      userId: string;
      ticket: { id: string };
    },
    msg: Message
  ): Promise<void> {
    const { id, expiresAt } = data;
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: id });
    await ticket.save();
    msg.ack();
  }
}
