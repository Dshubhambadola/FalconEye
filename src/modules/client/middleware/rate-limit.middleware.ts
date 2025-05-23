import { Request, Response, NextFunction } from 'express';
import { redis } from '../../../config/redis';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 20;

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const client = (req as any).client;
  if (!client || !client.apiKey) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

 const key = `rate-limit:${client.apiKey}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
  }

  if (current > MAX_REQUESTS) {
    res.status(429).json({ message: 'Rate limit exceeded' });
  } else {
    next();
  }
};