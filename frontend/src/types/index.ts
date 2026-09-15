export type Role = 'STUDENT' | 'KITCHEN_STAFF' | 'ADMIN';
export type DietaryType = 'VEGETARIAN' | 'NON_VEGETARIAN' | 'VEGAN' | 'EGG';
export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'MOCK' | 'UPI' | 'CARD' | 'ONLINE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  _count?: {
    foodItems: number;
  };
}

export interface FoodItem {
  id: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients: string;
  dietaryType: DietaryType;
  available: boolean;
  stockQuantity: number;
  preparationTime: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orderItems: number;
  };
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  foodItemId: string;
  foodItem: FoodItem;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  orderId: string;
  transactionReference: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  gatewayResponse?: string | null;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  changedBy?: string | null;
  user?: {
    id: string;
    name: string;
    role: Role;
  } | null;
  notes?: string | null;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  pickupTime?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: Payment | null;
  statusHistory?: OrderStatusHistory[];
}

export interface Notification {
  id: string;
  userId: string;
  orderId?: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SalesOverview {
  totalSales: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalOrders: number;
  todayOrdersCount: number;
  pendingOrders: number;
  averageOrderValue: number;
  totalStudents: number;
  totalKitchenStaff: number;
  totalFoods: number;
}

export interface DailyTrend {
  date: string;
  sales: number;
  orders: number;
}

export interface PopularFood {
  id: string;
  name: string;
  category: string;
  dietaryType: DietaryType;
  price: number;
  imageUrl: string;
  quantitySold: number;
  revenue: number;
  percentageContribution: number;
}

export interface CategorySales {
  categoryId: string;
  name: string;
  revenue: number;
  quantity: number;
  percentage: number;
}

export interface MovingAverageForecast {
  foodItemId: string;
  foodName: string;
  categoryName: string;
  dietaryType: DietaryType;
  windowSize: number;
  dataPointsAvailable: number;
  isSufficientData: boolean;
  statusMessage: string;
  historicalDemand: Array<{
    date: string;
    quantity: number;
    revenue: number;
    orderCount: number;
  }>;
  movingAverageValue: number | null;
  forecastDemand: number | null;
  suggestedPreparation: {
    min: number;
    max: number;
    recommended: number;
    bufferPercentage: number;
  } | null;
  calculationBreakdown: {
    formula: string;
    windowValues: number[];
    sum: number;
    average: number;
  } | null;
}
