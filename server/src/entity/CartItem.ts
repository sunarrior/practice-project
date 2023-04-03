import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Cart from "./Cart";
import Product from "./Product";

@Entity({ name: "cart_item" })
export default class CartItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({
    name: "created_at",
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  public updatedAt: Date;

  @Column()
  public quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  public cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  public product: Product;
}
