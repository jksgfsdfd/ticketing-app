import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@maanas.backend/commons";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
