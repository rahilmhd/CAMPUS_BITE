import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const JWT_SECRET = process.env.JWT_SECRET || 'campusbite_super_secret_jwt_key_2026_mca_project';
export const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '7d';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const PORT = parseInt(process.env.PORT || '5000', 10);
