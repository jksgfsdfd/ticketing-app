import { Listener, OrderCreatedEvent, Subjects } from "@maanas.backend/commons";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expirationQueue";
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
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
