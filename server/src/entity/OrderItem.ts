import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import Order from "./Order";
import Product from "./Product";

@Entity({ name: "order_item" })
export default class OrderItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public quantity: number;

  @Column()
  public price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  public order: Order;

  @OneToOne(() => Product)
  @JoinColumn()
  public product: Product;
}
