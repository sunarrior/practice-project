import { Repository } from "typeorm";

import { dataSource } from "../config/data-source.config";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";

const cartRepos: Repository<Cart> = dataSource.getRepository(Cart);
const cartItemRepos: Repository<CartItem> = dataSource.getRepository(CartItem);

const getCartByUsername = async (username: string): Promise<Cart | null> => {
  const result: Cart | null = await cartRepos.findOne({
    relations: {
      cartItems: {
        product: true,
      },
    },
    where: {
      user: {
        username,
      },
    },
  });
  return result;
};

const getCartState = async (userid: number): Promise<Cart | null> => {
  const result: Cart | null = await cartRepos.findOne({
    relations: {
      cartItems: true,
    },
    where: {
      user: {
        id: userid,
      },
    },
  });
  return result;
};

const getAllCartItems = async (userid: number): Promise<CartItem[]> => {
  const result: CartItem[] = await cartItemRepos.find({
    relations: {
      product: {
        productImages: true,
      },
    },
    where: {
      cart: {
        user: {
          id: userid,
        },
      },
    },
  });
  return result;
};

const getCartItemById = async (itemid: number): Promise<CartItem | null> => {
  const result: CartItem | null = await cartItemRepos.findOneBy({ id: itemid });
  return result;
};

const getCartItemsByProductId = async (
  productid: number
): Promise<CartItem[]> => {
  const result: CartItem[] = await cartItemRepos.find({
    where: {
      product: {
        id: productid,
      },
    },
  });
  return result;
};

const createCart = async (cart: Cart): Promise<void> => {
  await cartRepos.save(cart);
};

const addCartItem = async (cartItem: CartItem): Promise<void> => {
  await cartItemRepos.save(cartItem);
};

const updateCartItem = async (cartItem: CartItem): Promise<void> => {
  await cartItemRepos.update(cartItem.id, cartItem);
};

const removeItem = async (cartItem: CartItem[]): Promise<void> => {
  await cartItemRepos.remove(cartItem);
};

export default {
  getCartByUsername,
  getCartState,
  getAllCartItems,
  getCartItemById,
  getCartItemsByProductId,
  createCart,
  addCartItem,
  updateCartItem,
  removeItem,
};
