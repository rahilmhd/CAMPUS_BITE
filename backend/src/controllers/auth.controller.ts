import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      ApiResponse.success(res, result, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Unauthorized', 401);
        return;
      }
      const user = await AuthService.getCurrentUser(req.user.id);
      ApiResponse.success(res, user, 'User profile fetched');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    // JWT is stateless on client; client clears token. Server responds with success.
    ApiResponse.success(res, null, 'Logged out successfully');
  }
}
