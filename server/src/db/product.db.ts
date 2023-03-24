import { dataSource } from "../config/data-source.config";
import Product from "../entity/Product";
import ProductImage from "../entity/ProductImage";

const productRepos = dataSource.getRepository(Product);
const productImageRepos = dataSource.getRepository(ProductImage);

const getAllProducts = async (): Promise<Product[]> => {
  const products: Product[] = await productRepos.find({
    relations: {
      productCategories: {
        category: true,
      },
      productImages: true,
    },
  });
  return products;
};

const getProductByCategory = async (categoryid: number): Promise<Product[]> => {
  const result = await productRepos.find({
    relations: {
      productImages: true,
    },
    where: {
      productCategories: {
        category: {
          id: categoryid,
        },
      },
    },
  });
  return result;
};

const getProductThumbnail = async (
  productid: number
): Promise<ProductImage> => {
  const result = await productImageRepos.find({
    where: {
      product: {
        id: productid,
      },
    },
  });
  const thumbnail = result.filter((image) => image.isDefault === true);
  return thumbnail[0];
};

const getProductDetail = async (
  productid: number,
  relations: boolean
): Promise<Product | null> => {
  const result: Product | null = await productRepos.findOne({
    relations: {
      productImages: relations,
      productCategories: {
        category: true,
      },
    },
    where: {
      id: productid,
    },
  });
  return result;
};

const updateProduct = async (
  productid: number,
  product: Product
): Promise<void> => {
  await productRepos.update(productid, product);
};

export default {
  getAllProducts,
  getProductByCategory,
  getProductThumbnail,
  getProductDetail,
  updateProduct,
};
