import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import OrderItem from "./OrderItem";
import User from "./User";

@Entity()
export default class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({
    name: "create_at",
    type: "timestamp",
    default: () => {
      "CURRENT_TIMESTAMP()";
    },
  })
  public createAt: Date;

  @Column({ name: "payment_method" })
  public paymentMethod: string;

  @Column({ name: "payment_day", type: "timestamp", nullable: true })
  public paymentDay: Date;

  @Column({ name: "complete_day", type: "timestamp", nullable: true })
  public completeDay: Date;

  @Column({ name: "delivery_address" })
  public deliveryAddress: string;

  @Column()
  public status: string;

  @ManyToOne(() => User, (user) => user.orders)
  public user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public orderItems: OrderItem[];
}
