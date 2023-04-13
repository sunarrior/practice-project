import { Request, Response } from "express";

import { common, cartConstant } from "../constant/controller.constant";
import { CartItemData } from "../interface/CartData";
import userDB from "../db/user.db";
import cartDB from "../db/cart.db";
import productDB from "../db/product.db";
import User from "../entity/User";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Product from "../entity/Product";
import ProductImage from "../entity/ProductImage";

const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = req.id;

    // check if user is exists
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    const result: CartItem[] = await cartDB.getAllCartItems(user.id);
    const cartItems: CartItemData[] = await Promise.all(
      result.map(async (item: CartItem) => {
        const thumbnail: ProductImage = await productDB.getProductThumbnail(
          item.product.id
        );
        return {
          id: item?.id,
          product: {
            id: item?.product?.id,
            name: item?.product?.name,
            price: item?.product?.price,
          },
          quantity: item?.quantity,
          url: thumbnail?.url,
        };
      })
    );

    res.status(200).json({ cartItems });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const addCartItem = async (req: Request, res: Response) => {
  try {
    if (!req.query.additem) {
      return res.status(400).json({ msg: cartConstant.INVALID_ACTION });
    }

    const id: number | undefined = req.id;
    const { productid, quantity } = req.body;

    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        msg: common.USER_BLOCKED,
      });
    }

    // get cart info
    const cart: Cart | null = await cartDB.getCartByUsername(user.username);

    // get product info
    const product: Product | null = await productDB.getProductDetail(
      productid,
      false
    );

    if (!cart || !product) {
      return res.status(400).json({ msg: common.DEFAULT });
    }

    if (cart.cartItems.length) {
      // check if item already in cart
      const cartItemFromCart: CartItem[] | undefined = cart?.cartItems.filter(
        (item: CartItem) => item.product.id === Number(productid)
      );

      // update cart state
      if (cartItemFromCart.length) {
        await cartDB.updateCartItem({
          ...cartItemFromCart[0],
          quantity: cartItemFromCart[0].quantity + quantity,
        });

        return res.status(200).json({
          msg: cartConstant.CART_ADD_SUSSESSFULLY,
          productState: "old",
        });
      }
    }

    // add new item to cart
    const cartItem: CartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.quantity = quantity;
    await cartDB.addCartItem(cartItem);

    res.status(200).json({
      msg: cartConstant.CART_ADD_SUSSESSFULLY,
      productState: "new",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const removeItems = async (req: Request, res: Response) => {
  try {
    const ids: number[] = req.body;
    const items: (CartItem | null)[] = await Promise.all(
      ids.map(async (id: number) => {
        const result: CartItem | null = await cartDB.getCartItemById(id);
        return result;
      })
    );
    const filterItems: (CartItem | null)[] = items.filter(
      (item: CartItem | null) => item !== null && item !== undefined
    );
    await cartDB.removeItem(filterItems as CartItem[]);
    res.status(200).json({
      msg: cartConstant.ITEMS_REMOVE_SUSSESSFULLY,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

export default {
  getAllCartItems,
  addCartItem,
  removeItems,
};
