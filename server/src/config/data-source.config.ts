import { DataSource } from "typeorm";
import EnvConfig from "./env.config";
import User from "../entity/User";
import Cart from "../entity/Cart";
import CartItem from "../entity/CartItem";
import Category from "../entity/Category";
import Product from "../entity/Product";
import ProductCategory from "../entity/ProductCategory";
import Order from "../entity/Order";
import OrderItem from "../entity/OrderItem";
import ProductImage from "../entity/ProductImage";

export const dataSource: DataSource = new DataSource({
  type: EnvConfig.DB_TYPE,
  host: EnvConfig.DB_HOST,
  port: EnvConfig.DB_PORT,
  username: EnvConfig.DB_USERNAME,
  password: EnvConfig.DB_PASSWORD,
  database: EnvConfig.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Cart,
    CartItem,
    Category,
    Product,
    ProductImage,
    ProductCategory,
    Order,
    OrderItem,
  ],
});
