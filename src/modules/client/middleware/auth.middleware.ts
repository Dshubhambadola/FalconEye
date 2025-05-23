import { Request, Response, NextFunction } from 'express';
import { ClientModel } from '../infrastructure/client.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const apiKey = authHeader.split(' ')[1];

  try {
    const client = await ClientModel.findOne({ apiKey, active: true });
    if (!client) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Attach client info to request object
    (req as any).client = client;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};