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

export interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[];
      description?: string;
    };
    unit_amount: number;
  };
  quantity: number;
}
