/* eslint-disable array-callback-return */
import { Request, Response } from "express";

import productDB from "../db/product.db";
import Product from "../entity/Product";
import ProductCategory from "../entity/ProductCategory";
import ProductImage from "../entity/ProductImage";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await productDB.getAllProducts();
    let productList = result.map((product: Product) => {
      if (product?.quantity > 0) {
        return {
          id: product?.id,
          name: product?.name,
          price: product?.price,
          url: product?.productImages?.filter(
            (image: ProductImage) => image.isDefault
          )[0]?.url,
          categories: product?.productCategories.map(
            (productCategory: ProductCategory) => productCategory.category.name
          ),
        };
      }
    });
    productList = productList.filter((product: any) => product !== undefined);
    res.status(200).json({ stauts: "success", productList: productList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryid } = req.params;
    const result: Product[] = await productDB.getProductByCategory(
      categoryid as unknown as number
    );
    let productList = result.map((product: Product) => {
      if (product?.quantity > 0) {
        return {
          id: product?.id,
          name: product?.name,
          price: product?.price,
          url: product?.productImages?.filter(
            (image: ProductImage) => image.isDefault
          )[0]?.url,
        };
      }
    });
    productList = productList.filter((product: any) => product !== undefined);
    res.status(200).json({ status: "success", productList: productList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const product: Product | null = await productDB.getProductDetail(
      productId as unknown as number,
      true
    );
    const productDetail = {
      name: product?.name,
      quantity: product?.quantity,
      price: product?.price,
      description: product?.description,
      imageList: product?.productImages?.map(
        (image: ProductImage) => image.url
      ),
      categories: product?.productCategories.map(
        (productCategory: ProductCategory) => productCategory.category.name
      ),
    };
    res.status(200).json({ stauts: "success", productDetail: productDetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getAllProducts,
  getProductByCategory,
  getProductDetail,
};
