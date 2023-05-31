import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@maanas.backend/commons";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ): Promise<void> {
    const { id, title, price, userId, version } = data;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    ticket.set({ title, price, userId, version });

    await ticket.save();

    msg.ack();
  }
}
