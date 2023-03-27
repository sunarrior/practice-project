import { Request, Response } from "express";

import userDB from "../db/user.db";
import cartDB from "../db/cart.db";
import productDB from "../db/product.db";
import User from "../entity/User";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Product from "../entity/Product";
import ProductImage from "../entity/ProductImage";

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

          return res.status(200).json({
            status: "success",
            msg: "Cart added successfully.",
            productState: "old",
          });
        }
      }

      const cartItem: CartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.quantity = quantity;
      await cartDB.addCartItem(cartItem);

      res.status(200).json({
        status: "success",
        msg: "Cart added successfully.",
        productState: "new",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getCartState = async (req: Request, res: Response) => {
  try {
    const { username } = req.session;

    // check if user is exists
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    // get cart info
    const cart: Cart | null = await cartDB.getCartState(user.id);
    if (!cart) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    res
      .status(200)
      .json({ status: "success", cartState: cart.cartItems.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const { username } = req.session;

    // check if user is exists
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    const result: CartItem[] = await cartDB.getAllCartItems(user.id);
    const cartItems: any[] = await Promise.all(
      result.map(async (item: CartItem) => {
        const thumbnail: ProductImage = await productDB.getProductThumbnail(
          item.product.id
        );
        return {
          id: item?.id,
          name: item?.product?.name,
          quantity: item?.quantity,
          price: item?.product?.price,
          url: thumbnail?.url,
        };
      })
    );

    res.status(200).json({ status: "success", cartItems: cartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const removeItems = async (req: Request, res: Response) => {
  try {
    const ids: number[] = req.body;
    const items = await Promise.all(
      ids.map(async (id: number) => {
        const result = await cartDB.getCartItemById(id);
        return result;
      })
    );
    const filterItems = items.filter((item: CartItem | null) => item !== null);
    await cartDB.removeItem(filterItems as CartItem[]);
    res.status(200).json({
      status: "success",
      msg: "Items removed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  addCartItem,
  getCartState,
  getAllCartItems,
  removeItems,
};
