import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Product from "./Product";

@Entity({ name: "product_image" })
export default class ProductImage {
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
  public url: string;

  @Column({ name: "is_default", default: false })
  public isDefault: boolean;

  @ManyToOne(() => Product, (product) => product.productImages)
  public product: Product;
}
