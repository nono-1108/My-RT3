import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
