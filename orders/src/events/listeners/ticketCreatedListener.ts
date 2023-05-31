import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@maanas.backend/commons";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
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

    const ticket = Ticket.build({
      id,
      title,
      userId,
      price,
      version,
    });
    console.log("Got ticket");
    await ticket.save();

    msg.ack();
  }
}
