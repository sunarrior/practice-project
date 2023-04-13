import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Order from "./Order";

@Entity()
export default class User {
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
  public role: string;

  @Column({ unique: true })
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ name: "full_name", nullable: true })
  public fullName: string;

  @Column({ type: "date", nullable: true })
  public dob: Date;

  @Column({ nullable: true })
  public gender: boolean;

  @Column({ nullable: true })
  public phone: string;

  @Column({ name: "delivery_address", nullable: true })
  public deliveryAddress: string;

  @Column({ name: "avatar_url", nullable: true })
  public avatarUrl: string;

  @Column({ name: "is_verified", default: false })
  public isVerified: boolean;

  @Column({ name: "is_blocked", default: false })
  public isBlocked: boolean;

  @Column({ name: "token_store", type: "text", nullable: true })
  public tokenStore: string | null;

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public orders: Order[];
}
