import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Product from "./Product";

@Entity({ name: "product_image" })
export default class ProductImage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column({ name: "is_default", default: false })
  public isDefault: boolean;

  @ManyToOne(() => Product, (product) => product.productImages)
  public product: Product;
}
