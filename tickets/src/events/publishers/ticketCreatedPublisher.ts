import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@maanas.backend/commons";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
