// src/modules/event/interfaces/event.controller.ts
import { Router, Request, Response } from 'express';
import { EventService } from '../application/event.service';
import { EventEntity } from '../domain/event.entity';

const router: Router = Router();

const createEventHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appId, userId, type, payload, timestamp } = req.body;

    if (!appId || !userId || !type || !timestamp) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const event: EventEntity = {
      appId,
      userId,
      type,
      payload,
      timestamp: new Date(timestamp),
    };

    await EventService.createEvent(event);
    res.status(201).json({ message: 'Event received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

router.post('/', createEventHandler);

export default router;
