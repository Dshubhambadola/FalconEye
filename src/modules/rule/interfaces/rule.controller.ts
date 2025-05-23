import { Router, Request, Response } from 'express';
import { RuleModel } from '../infrastructure/rule.model';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const rule = await RuleModel.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(400).json({ message: 'Invalid rule', error: err });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  const rules = await RuleModel.find();
  res.json(rules);
});

export default router;