import { RuleModel } from '../infrastructure/rule.model';
import { EventModel } from '../../event/infrastructure/event.model';
import { AlertModel } from '../../alert/infrastructure/alert.model';

export class RuleService {
  static async evaluateRulesForEvent(event: any) {
    const rules = await RuleModel.find({
      appId: event.appId,
      eventType: event.type,
      enabled: true
    });

    for (const rule of rules) {
      if (!rule.condition) continue;
      const since = new Date(Date.now() - rule.condition.windowSeconds * 1000);
      const count = await EventModel.countDocuments({
        appId: event.appId,
        type: event.type,
        [rule.field]: event[rule.field],
        timestamp: { $gte: since }
      });

      if (count >= rule.condition.max) {
        await AlertModel.create({
          ruleId: rule._id,
          appId: event.appId,
          userId: event.userId,
          event,
          triggeredAt: new Date()
        });
      }
    }
  }
}