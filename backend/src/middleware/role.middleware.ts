import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, RoleType } from '../types/index.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const requireRole = (allowedRoles: RoleType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponse.error(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      ApiResponse.error(res, `Access denied. Requires one of: ${allowedRoles.join(', ')}`, 403);
      return;
    }

    next();
  };
};
