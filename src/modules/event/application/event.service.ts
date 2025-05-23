import { EventEntity } from '../domain/event.entity';
import { EventModel } from '../infrastructure/event.model';
import { RuleService } from '../../rule/application/rule.service';

export class EventService {
  static async createEvent(event: EventEntity) {
    const savedEvent = await EventModel.create(event);
    await RuleService.evaluateRulesForEvent(savedEvent);
    return savedEvent;
  }
}