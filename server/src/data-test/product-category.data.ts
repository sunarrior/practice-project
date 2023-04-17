import ProductCategory from "../entity/ProductCategory";
import { category001, category002 } from "./category.data";
import { product001, product002, product003 } from "./product.data";

const productCategory001 = new ProductCategory();
productCategory001.category = category001;
productCategory001.product = product001;

const productCategory002 = new ProductCategory();
productCategory002.category = category002;
productCategory002.product = product002;

const productCategory003 = new ProductCategory();
productCategory003.category = category001;
productCategory003.product = product003;

const productCategory004 = new ProductCategory();
productCategory004.category = category002;
productCategory004.product = product003;

export {
  productCategory001,
  productCategory002,
  productCategory003,
  productCategory004,
};
