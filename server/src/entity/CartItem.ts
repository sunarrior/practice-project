import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import Cart from "./Cart";
import Product from "./Product";

@Entity({ name: "cart_item" })
export default class CartItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  public cart: Cart;

  @OneToOne(() => Product, { onDelete: "CASCADE", onUpdate: "NO ACTION" })
  @JoinColumn()
  public product: Product;
}
