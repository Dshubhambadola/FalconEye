import { EventEntity } from '../domain/event.entity';
import { EventModel } from '../infrastructure/event.model';

export class EventService {
  static async createEvent(event: EventEntity) {
    return await EventModel.create(event);
  }
}