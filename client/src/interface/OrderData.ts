export interface OrderData {
  id?: number;
  username?: string;
  paymentMethod: string;
  orderDay: Date;
  paymentDay?: Date | undefined;
  completeDay: Date | undefined;
  firstItem?: string;
  totalItems?: number;
  cost: number;
}

export interface OrderInfo {
  username?: string;
  paymentMethod: string;
  orderDay: string;
  paymentDay: string;
  completeDay: string;
  cost: number;
}

export interface OrderItemData {
  id: number;
  url: string | undefined;
  productName: string;
  quantity: number;
  price: number;
}

export interface PaymentOption {
  paymentMethod: string;
  deliveryAddress: string;
}
