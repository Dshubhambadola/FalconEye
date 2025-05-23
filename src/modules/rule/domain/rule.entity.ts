export interface RuleEntity {
  appId: string;
  name: string;
  eventType: string;
  field: string;
  condition: {
    max: number;
    windowSeconds: number;
  };
  enabled: boolean;
}