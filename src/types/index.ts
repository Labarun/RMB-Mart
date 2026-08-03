export type UserRole = "CUSTOMER" | "ADMIN";
export type PayoutType = "ALIPAY" | "WECHAT";
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "REFUNDED"
  | "CANCELLED";

export interface ExchangeRateData {
  id: string;
  rateGhsToRmb: number;
  updatedAt: Date;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  amountGhs: number;
  amountRmb: number;
  rateUsed: number;
  payoutType: PayoutType;
  recipientName: string;
  recipientAccountId: string;
  recipientQrUrl: string | null;
  status: OrderStatus;
  externalTxnId: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

export interface DashboardMetrics {
  totalVolume: number;
  completedOrders: number;
  pendingOrders: number;
  totalOrders: number;
}
