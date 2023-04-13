import { PaymentOption } from "./OrderData";

export interface CartItemData {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  url: string;
}

export interface AddCartData {
  productid: number;
  quantity: number;
}

export interface PlaceOrderData {
  items: CartItemData[];
  paymentOption: PaymentOption;
}
