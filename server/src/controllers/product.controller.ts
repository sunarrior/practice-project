/* eslint-disable array-callback-return */
import { Request, Response } from "express";

import productDB from "../db/product.db";
import categoryDB from "../db/category.db";
import Product from "../entity/Product";
import Category from "../entity/Category";
import ProductCategory from "../entity/ProductCategory";
import ProductImage from "../entity/ProductImage";
import cloudinary from "../config/cloudinary.config";

const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, categories, description, quantity, price, filesPath } =
      req.body;
    const product: Product = new Product();
    product.name = name;
    product.description = description;
    product.quantity = quantity;
    product.price = price;

    const categoryList: Category[] = await Promise.all(
      categories.map(async (category: any) => {
        const tmpcategory = await categoryDB.getCategoryById(category.id);
        return tmpcategory;
      })
    );
    const newProduct: Product = await productDB.addProduct(product);
    const productCategories: ProductCategory[] = categoryList.map(
      (category: any) => {
        const productCategory: ProductCategory = new ProductCategory();
        productCategory.product = newProduct;
        productCategory.category = category;
        return productCategory;
      }
    );
    await productDB.addProductCategory(productCategories);
    const imageList: ProductImage[] = await Promise.all(
      filesPath.map(async (image: any) => {
        const productImage: ProductImage = new ProductImage();
        await cloudinary.uploader.upload(
          image.url,
          { folder: "product_img" },
          async (error: any, result: any) => {
            productImage.url = result.secure_url;
          }
        );
        productImage.product = newProduct;
        productImage.isDefault = image.isDefault;
        return productImage;
      })
    );
    productDB.addProductImage(imageList);
    res
      .status(200)
      .json({ status: "success", msg: "Added product successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

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
  addProduct,
  getAllProducts,
  getProductByCategory,
  getProductDetail,
};
