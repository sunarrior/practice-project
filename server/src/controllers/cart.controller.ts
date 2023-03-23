import { Request, Response } from "express";

import cartDB from "../db/cart.db";
import productDB from "../db/product.db";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Product from "../entity/Product";

const addCartItem = async (req: Request, res: Response) => {
  try {
    if (req.query.additem) {
      const { username } = req.session;
      const { productid, quantity } = req.body;

      // get cart info
      const cart: Cart | null = await cartDB.getCartByUsername(
        username as string
      );

      // get product info
      const product: Product | null = await productDB.getProductDetail(
        productid,
        false
      );

      if (!cart || !product) {
        return res
          .status(200)
          .json({ status: "failed", msg: "something went wrong" });
      }

      if (cart.cartItems.length) {
        // check if item already in cart
        const cartItemFromCart: CartItem[] | undefined = cart?.cartItems.filter(
          (item: CartItem) => item.product.id === Number(productid)
        );

        if (cartItemFromCart.length) {
          await cartDB.updateCartItem({
            ...cartItemFromCart[0],
            quantity: cartItemFromCart[0].quantity + quantity,
          });

          return res
            .status(200)
            .json({ status: "success", msg: "Cart added successfully." });
        }
      }

      const cartItem: CartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
      await cartDB.addCartItem(cartItem);

      res
        .status(200)
        .json({ status: "success", msg: "Cart added successfully." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  addCartItem,
};
