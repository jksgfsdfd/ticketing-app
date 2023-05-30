// we would need this as we need to differentiate among tickets associated and non-associated with orders
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
  OrderCancelledEvent,
} from "@maanas.backend/commons";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  async onMessage(
    data: { id: string; ticket: { id: string } },
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
  }
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
}
