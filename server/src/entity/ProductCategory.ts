import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import Category from "./Category";
import Product from "./Product";

@Entity({ name: "product_category" })
export default class ProductCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => Category, (category) => category.productCategories)
  public category: Category;

  @ManyToOne(() => Product, (product) => product.productCategories, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  public product: Product;
}
