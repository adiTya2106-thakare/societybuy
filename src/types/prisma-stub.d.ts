// This stub only applies before `npx prisma generate` is run.
// It is overridden by the generated @prisma/client once prisma generate runs.
// Remove this file after running prisma generate.

declare module "@prisma/client" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class PrismaClient {
    constructor(options?: unknown);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Prisma: any;

  export enum UserRole {
    RESIDENT = "RESIDENT",
    MERCHANT = "MERCHANT",
    DELIVERY_PARTNER = "DELIVERY_PARTNER",
    SOCIETY_ADMIN = "SOCIETY_ADMIN",
    PLATFORM_ADMIN = "PLATFORM_ADMIN",
  }
  export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
  }
  export enum DealStatus {
    DRAFT = "DRAFT",
    SCHEDULED = "SCHEDULED",
    OPEN = "OPEN",
    QUALIFIED = "QUALIFIED",
    FULFILLING = "FULFILLING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
  }
  export enum CommitmentStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    CONVERTED = "CONVERTED",
    EXPIRED = "EXPIRED",
  }
  export enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    PACKED = "PACKED",
    DISPATCHED = "DISPATCHED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUND_REQUESTED = "REFUND_REQUESTED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  }
  export enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  }
  export enum PaymentMethod {
    UPI = "UPI",
    CARD = "CARD",
    NET_BANKING = "NET_BANKING",
    WALLET = "WALLET",
    COD = "COD",
    SIMULATED = "SIMULATED",
  }
  export enum DeliveryStatus {
    ASSIGNED = "ASSIGNED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    RETURNED = "RETURNED",
  }
  export enum NotificationType {
    ORDER_CONFIRMED = "ORDER_CONFIRMED",
    ORDER_SHIPPED = "ORDER_SHIPPED",
    ORDER_DELIVERED = "ORDER_DELIVERED",
    DEAL_QUALIFIED = "DEAL_QUALIFIED",
    DEAL_FAILED = "DEAL_FAILED",
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    MEMBERSHIP_APPROVED = "MEMBERSHIP_APPROVED",
    MEMBERSHIP_REJECTED = "MEMBERSHIP_REJECTED",
    SUPPORT_UPDATE = "SUPPORT_UPDATE",
    LOW_STOCK_ALERT = "LOW_STOCK_ALERT",
    SYSTEM = "SYSTEM",
  }
  export enum MerchantStatus {
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    REJECTED = "REJECTED",
  }
  export enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ARCHIVED = "ARCHIVED",
  }
}
