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

export interface CartItemMail {
  name: string;
  quantity: number;
  price: number;
}
