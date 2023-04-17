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

export function isInstanceOfCartItemData(object: any) {
  const cartItemProps: string[] = ["id", "product", "quantity"];
  const productProps: string[] = ["id", "name", "price"];
  for (let i = 0; i < cartItemProps.length; i += 1) {
    if (!(cartItemProps[i] in object)) {
      return false;
    }
  }
  for (let i = 0; i < productProps.length; i += 1) {
    if (!(productProps[i] in object.product)) {
      return false;
    }
  }
  return true;
}

export interface CartItemMail {
  name: string;
  quantity: number;
  price: number;
}
