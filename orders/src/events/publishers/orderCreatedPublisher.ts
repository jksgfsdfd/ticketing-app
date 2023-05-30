import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@maanas.backend/commons";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
