/* eslint-disable import/prefer-default-export */
import { createContext, Context, Dispatch, SetStateAction } from "react";

type Cart = {
  cartState?: number;
  setCartState?: Dispatch<SetStateAction<number>>;
};
const obj: Cart = {};
export const CartContext: Context<Cart> = createContext(obj);
