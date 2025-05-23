export interface EventEntity {
  appId: string;
  userId: string;
  type: string;
  payload?: Record<string, any>;
  timestamp: Date;
}