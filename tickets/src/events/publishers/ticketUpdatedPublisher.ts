import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@maanas.backend/commons";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
