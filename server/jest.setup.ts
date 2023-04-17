import { Repository } from "typeorm";

import { dataSource } from "./src/config/data-source.config";
import { redisClient } from "./src/config/redis-cache.config";
import User from "./src/entity/User";
import Category from "./src/entity/Category";
import Product from "./src/entity/Product";
import ProductCategory from "./src/entity/ProductCategory";
import Cart from "./src/entity/Cart";
import CartItem from "./src/entity/CartItem";
import { redis } from "./src/utils";

import { user001, user002, user003, user004 } from "./src/data-test/user.data";
import { category001, category002 } from "./src/data-test/category.data";
import { product001, product002, product003 } from "./src/data-test/product.data";
import { 
  productCategory001,
  productCategory002,
  productCategory003,
  productCategory004,
} from "./src/data-test/product-category.data";
import { cart001 } from "./src/data-test/cart.data";
import { cartItem001 } from "./src/data-test/cart-item.data";

beforeAll(async () => {
  await dataSource.initialize();
  await redisClient.connect();
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userRepos: Repository<User> = dataSource.getRepository(User);
  const newUser: User[] = await userRepos.save([user001, user002, user003, user004]);

  const categoryRepos: Repository<Category> = dataSource.getRepository(Category);
  await categoryRepos.save([category001, category002]);

  const productRepos: Repository<Product> = dataSource.getRepository(Product);
  await productRepos.save([product001, product002, product003]);

  const productCategoryRepos: Repository<ProductCategory>
    = dataSource.getRepository(ProductCategory);
  await productCategoryRepos.save([
    productCategory001,
    productCategory002,
    productCategory003,
    productCategory004
  ]);

  const cartRepos: Repository<Cart> = dataSource.getRepository(Cart);
  const cpCart001: Cart = { ...cart001, user: newUser[0] };
  const newCart: Cart = await cartRepos.save(cpCart001);

  const cartItemRepos: Repository<CartItem> = dataSource.getRepository(CartItem);
  const cpCartItem001: CartItem = { ...cartItem001, cart: newCart };
  await cartItemRepos.save(cpCartItem001);

  // valid verify token for username test010
  const verifyToken: string = "123456789abcdefabc";
  await redis.setCache(verifyToken, "test010", 120);

  // fake token with username test011
  const fakeVerifyToken: string = "123456789abcdefabb";
  await redis.setCache(fakeVerifyToken, "test011", 120);
});

afterAll(async () => {
  await dataSource.destroy();
  await redisClient.quit();
});
