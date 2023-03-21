import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import ProductCategory from "./ProductCategory";

@Entity()
export default class Category {
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
