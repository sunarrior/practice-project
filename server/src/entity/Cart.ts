import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import CartItem from "./CartItem";
import User from "./User";

@Entity()
export default class Cart {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => User, { onDelete: "CASCADE", onUpdate: "NO ACTION" })
  @JoinColumn()
  public user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public cartItems: CartItem[];
}
