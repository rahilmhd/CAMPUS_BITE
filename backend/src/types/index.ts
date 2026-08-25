import { Request } from 'express';

export const Role = {
  STUDENT: 'STUDENT',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  ADMIN: 'ADMIN',
} as const;
export type RoleType = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export const DietaryType = {
  VEGETARIAN: 'VEGETARIAN',
  NON_VEGETARIAN: 'NON_VEGETARIAN',
  VEGAN: 'VEGAN',
  EGG: 'EGG',
} as const;
export type DietaryTypeValue = (typeof DietaryType)[keyof typeof DietaryType];

export const OrderStatus = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  MOCK: 'MOCK',
  UPI: 'UPI',
  CARD: 'CARD',
  ONLINE: 'ONLINE',
} as const;
export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface AuthUserPayload {
  id: string;
  email: string;
  role: RoleType;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
