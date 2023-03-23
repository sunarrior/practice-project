import { dataSource } from "../config/data-source.config";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";

const cartRepos = dataSource.getRepository(Cart);
const cartItemRepos = dataSource.getRepository(CartItem);

const createCart = async (cart: Cart): Promise<void> => {
  await cartRepos.save(cart);
};

const getCartByUsername = async (username: string): Promise<Cart | null> => {
  const result: Cart | null = await cartRepos.findOne({
    relations: {
      cartItems: {
        product: true,
      },
    },
    where: {
      user: {
        username: username,
      },
    },
  });
  return result;
};

const addCartItem = async (cartItem: CartItem): Promise<void> => {
  await cartItemRepos.save(cartItem);
};

const updateCartItem = async (cartItem: CartItem): Promise<void> => {
  await cartItemRepos.update(cartItem.id, cartItem);
};

export default {
  createCart,
  getCartByUsername,
  addCartItem,
  updateCartItem,
};
