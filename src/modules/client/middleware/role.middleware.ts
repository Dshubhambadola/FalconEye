import { Request, Response, NextFunction } from 'express';

export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
  const client = (req as any).client;

  if (!client || client.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};