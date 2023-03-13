import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import ProductCategory from "./ProductCategory";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ name: "product_quantity" })
  public productQuantity: number;

  @Column()
  public description: string;

  @Column({ name: "thumbnail_url", nullable: true })
  public thumbnailUrl: string;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  public productCategories: ProductCategory[];
}
