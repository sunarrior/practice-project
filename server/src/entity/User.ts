import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Order from "./Order";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

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

  @Column({ type: "timestamp", nullable: true })
  public dob: Date;

  @Column({ nullable: true })
  public gender: boolean;

  @Column({ nullable: true })
  public phone: string;

  @Column({ name: "delivery_address", nullable: true })
  public deliveryAddress: string;

  @Column({ name: "avatar_url", nullable: true })
  public avatarUrl: string;

  @Column({ default: "active" })
  public status: string;

  @Column({ name: "is_verify", default: false })
  public isVerify: boolean;

  @Column({ name: "token_store", type: "text", nullable: true })
  public tokenStore: string;

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public orders: Order[];
}
