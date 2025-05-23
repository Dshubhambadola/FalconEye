import { Router, Request, Response } from 'express';
import { AlertModel } from '../infrastructure/alert.model';
import { requireAdminRole } from '../../client/middleware/role.middleware';

const router = Router();
router.use('/', (req, res, next) => {
  try {
    requireAdminRole(req, res, next);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const alerts = await AlertModel.find().sort({ triggeredAt: -1 }).limit(50);
  res.json(alerts);
});

export default router;