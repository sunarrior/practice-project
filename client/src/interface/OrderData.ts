import { CartItemData } from "./CartData";

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

export interface PlaceOrderData {
  items: CartItemData[];
  paymentOption: PaymentOption;
}
export interface PaymentInfo {
  orderData: PlaceOrderData;
  selectedPaymentMethod: string;
}

export interface SelectedOrder {
  selectedOrder: number[];
}
