import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@maanas.backend/commons";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
