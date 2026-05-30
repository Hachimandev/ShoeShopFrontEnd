export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  suggestedProducts?: SuggestedProduct[];
  orderCreated?: OrderCreatedInfo;
  actionTaken?: string;
  orderStep?: string; // Track order flow: ASKING_FOR_ADDRESS, ASKING_FOR_CONFIRMATION, ORDER_CREATED
}

export interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  relevanceScore?: number;
}

export interface OrderCreatedInfo {
  orderId: string;
  status: string;
  totalAmount: number;
  items: OrderItemInfo[];
  orderLink?: string; // Link to view order details
}

export interface OrderItemInfo {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface AIChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
  customerId?: string; // Customer ID for order creation
}

export interface AIChatResponse {
  message: string;
  suggestedProducts?: SuggestedProduct[];
  autoOrderCreated?: OrderCreatedInfo;
  actionPerformed?: string;
  orderStep?: string; // Track order flow: ASKING_FOR_ADDRESS, ASKING_FOR_CONFIRMATION, ORDER_CREATED
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
