import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import CartItem from "./CartItem";
import OrderItem from "./OrderItem";
import ProductCategory from "./ProductCategory";
import ProductImage from "./ProductImage";

@Entity()
export default class Product {
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
  public name: string;

  @Column({ default: 0 })
  public quantity: number;

  @Column({ default: 0 })
  public price: number;

  @Column()
  public description: string;

  @Column({ name: "is_delete", default: false })
  public isDelete: boolean;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  public productImages: ProductImage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  public orderItems: OrderItem[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product
  )
  public productCategories: ProductCategory[];
}
