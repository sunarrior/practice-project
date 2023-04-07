import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  public product: Product;
}
