import { Router, Request, Response } from 'express';
import { AlertModel } from '../infrastructure/alert.model';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const alerts = await AlertModel.find().sort({ triggeredAt: -1 }).limit(50);
  res.json(alerts);
});

export default router;