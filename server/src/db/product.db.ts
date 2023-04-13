import { Repository } from "typeorm";

import { dataSource } from "../config/data-source.config";
import Product from "../entity/Product";
import ProductCategory from "../entity/ProductCategory";
import ProductImage from "../entity/ProductImage";

const productRepos: Repository<Product> = dataSource.getRepository(Product);
const productCategoryRepos: Repository<ProductCategory> =
  dataSource.getRepository(ProductCategory);
const productImageRepos: Repository<ProductImage> =
  dataSource.getRepository(ProductImage);

const getAllProducts = async (): Promise<Product[]> => {
  const products: Product[] = await productRepos.find({
    relations: {
      productCategories: {
        category: true,
      },
      productImages: true,
    },
    where: {
      isDelete: false,
    },
  });
  return products;
};

const getProductByCategory = async (categoryid: number): Promise<Product[]> => {
  const result: Product[] = await productRepos.find({
    relations: {
      productImages: true,
    },
    where: {
      productCategories: {
        category: {
          id: categoryid,
        },
      },
      isDelete: false,
    },
  });
  return result;
};

const getProductById = async (productid: number): Promise<Product | null> => {
  const result: Product | null = await productRepos.findOne({
    where: {
      id: productid,
      isDelete: false,
    },
  });
  return result;
};

const getProductCategory = async (
  productid: number,
  categoryid: number
): Promise<ProductCategory | null> => {
  const result: ProductCategory | null = await productCategoryRepos.findOne({
    where: {
      product: {
        id: productid,
      },
      category: {
        id: categoryid,
      },
    },
  });
  return result;
};

const getProductThumbnail = async (
  productid: number
): Promise<ProductImage> => {
  const result: ProductImage[] = await productImageRepos.find({
    where: {
      product: {
        id: productid,
      },
    },
  });
  const thumbnail: ProductImage[] = result.filter(
    (image) => image.isDefault === true
  );
  return thumbnail[0];
};

const getProductImagesByProductId = async (
  productid: number
): Promise<ProductImage[]> => {
  const result: ProductImage[] = await productImageRepos.find({
    where: {
      product: {
        id: productid,
      },
    },
  });
  return result;
};

const getProductImageById = async (
  imageid: number
): Promise<ProductImage | null> => {
  const result: ProductImage | null = await productImageRepos.findOne({
    where: {
      id: imageid,
    },
  });
  return result;
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
      isDelete: false,
    },
  });
  return result;
};

const addProduct = async (product: Product): Promise<Product> => {
  const newProduct: Product = await productRepos.save(product);
  return newProduct;
};

const addProductCategory = async (
  productCategory: ProductCategory[]
): Promise<void> => {
  await productCategoryRepos.save(productCategory);
};

const addProductImage = async (productImage: ProductImage[]): Promise<void> => {
  await productImageRepos.save(productImage);
};

const updateProduct = async (
  productid: number,
  product: Product
): Promise<void> => {
  await productRepos.update(productid, product);
};

const updateProductImage = async (
  productImages: ProductImage[]
): Promise<void> => {
  await productImageRepos.save(productImages);
};

const removeProducts = async (products: Product[]): Promise<void> => {
  await productRepos.save(products);
};

const removeProductCategory = async (
  productCategory: ProductCategory[]
): Promise<void> => {
  await productCategoryRepos.remove(productCategory);
};

const removeProductImages = async (
  productImages: ProductImage[]
): Promise<void> => {
  await productImageRepos.remove(productImages);
};

export default {
  getAllProducts,
  getProductByCategory,
  getProductById,
  getProductCategory,
  getProductThumbnail,
  getProductImagesByProductId,
  getProductImageById,
  getProductDetail,
  addProduct,
  addProductCategory,
  addProductImage,
  updateProduct,
  updateProductImage,
  removeProducts,
  removeProductCategory,
  removeProductImages,
};
