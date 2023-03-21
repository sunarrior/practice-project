import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
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
  public createdAtt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  public updatedAt: Date;

  @Column()
  public name: string;

  @Column()
  public quantity: number;

  @Column()
  public price: number;

  @Column({ nullable: true })
  public description: string;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  public productCategories: ProductCategory[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public productImages: ProductImage[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  public orderItems: OrderItem[];
}
