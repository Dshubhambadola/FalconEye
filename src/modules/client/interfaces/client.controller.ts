import { Router, Request, Response } from 'express';
import { ClientModel } from '../infrastructure/client.model';
import crypto from 'crypto';

const router = Router();

// Utility: generate secure API key
const generateApiKey = (): string => crypto.randomBytes(32).toString('hex');

// Create new client with generated API key
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, appId } = req.body;
    const apiKey = generateApiKey();

    const client = await ClientModel.create({
      name,
      appId,
      apiKey,
      active: true
    });

    res.status(201).json({ apiKey, client });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create client', error: err });
  }
});

export default router;