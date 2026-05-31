export interface CartItemDTO {
  productDetailId: string;
  quantity: number;
  productName: string;
  price: number;
  size: number;
  color: string;
  stockQuantity: number;
  image: string;
}

export interface Cart {
  items: CartItemDTO[];
  promotionId?: string;
  usedPoints: number;
}

export interface CartSummary {
  subtotal: number;
  shippingFee: number;
  discountPromo: number;
  discountPoints: number;
  total: number;
  customerPoints: number;
}

export interface OrderRequest {
  userInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    paymentMethod: "COD" | "CARD" | "EWALLET" | "SEPAY"; // Phải khớp với Enum Backend
  };
  cart: Cart;
  totalAmount: number;
}

export interface OrderResponseDTO {
  orderId: string;
  totalAmount: number;
  orderStatus: string;
}

export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER", // Sẽ map cái này sang SEPAY
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
  AWAITING_CANCELLATION = "AWAITING_CANCELLATION",
}

export interface Order {
  orderId: string;
  orderDate: string;
  usedPoints: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: any; // Customer object
  promotion?: any; // Promotion object
  orderDetails: any[]; // OrderDetail array
  staff?: any; // Staff object
  returnOrder?: any; // ReturnOrder object
}
