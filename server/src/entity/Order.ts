import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import OrderItem from "./OrderItem";
import User from "./User";

@Entity()
export default class Order {
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

  @Column({ name: "payment_method" })
  public paymentMethod: string;

  @Column({ name: "payment_day", type: "timestamp", nullable: true })
  public paymentDay: Date;

  @Column({ name: "complete_day", type: "timestamp", nullable: true })
  public completeDay: Date;

  @Column({ name: "delivery_address" })
  public deliveryAddress: string;

  @Column({ nullable: true })
  public status: string;

  @ManyToOne(() => User, (user) => user.orders)
  public user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public orderItems: OrderItem[];
}
