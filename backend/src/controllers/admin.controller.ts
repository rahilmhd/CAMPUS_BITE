import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Role, UserStatus } from '../types/index.js';

export class AdminController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, role, status } = req.query;

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { email: { contains: search as string } },
          { phone: { contains: search as string } },
        ];
      }

      if (role) {
        where.role = role as string;
      }

      if (status) {
        where.status = status as string;
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      ApiResponse.success(res, users, 'Users retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password, role } = req.body;

      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existing) {
        ApiResponse.error(res, 'A user with this email already exists', 409);
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone?.trim() || null,
          passwordHash,
          role: role || Role.KITCHEN_STAFF,
          status: UserStatus.ACTIVE,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      ApiResponse.success(res, user, 'Staff user created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        ApiResponse.error(res, 'User not found', 404);
        return;
      }

      // Prevent deactivating primary admin account
      if (user.email === 'admin@campusbite.local') {
        ApiResponse.error(res, 'Cannot deactivate system root administrator', 400);
        return;
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { status: status ? UserStatus.ACTIVE : UserStatus.INACTIVE },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      ApiResponse.success(res, updated, `User account ${status ? 'activated' : 'deactivated'}`);
    } catch (error) {
      next(error);
    }
  }
}
