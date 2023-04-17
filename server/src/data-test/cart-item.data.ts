import CartItem from "../entity/CartItem";
import { product001 } from "./product.data";

const cartItem001: CartItem = new CartItem();
cartItem001.quantity = 1;
cartItem001.product = product001;

export { cartItem001 };
