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
      imageList: product?.productImages?.map((image: ProductImage) => {
        return {
          id: image.id,
          url: image.url,
          isDefault: image.isDefault,
        };
      }),
      categories: product?.productCategories.map(
        (productCategory: ProductCategory) => {
          return {
            id: productCategory.category.id,
            name: productCategory.category.name,
          };
        }
      ),
    };
    res.status(200).json({ stauts: "success", productDetail: productDetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const updateProductDetail = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      removeCategories,
      newCategories,
      description,
      quantity,
      price,
      filesPath,
      imagesUpdate,
      imagesRemove,
    } = req.body;

    // check if product exists
    const product: Product | null = await productDB.getProductById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    // remove image if have some
    const imageRemoveList: ProductImage[] = await Promise.all(
      imagesRemove.map(async (image: any) => {
        const productImage: ProductImage | null =
          await productDB.getProductImageById(image.id);
        return productImage;
      })
    );
    const imageRemoveListFilter: ProductImage[] = await Promise.all(
      imageRemoveList.filter(async (image: ProductImage) => {
        if (image) {
          const imagePID = image.url.split("/")[8].split(".")[0];
          await cloudinary.uploader.destroy(`product_img/${imagePID}`);
          return true;
        }
        return false;
      })
    );
    await productDB.removeProductImages(imageRemoveListFilter);

    // update image if have some
    if (imagesUpdate.length > 0) {
      const productImages: ProductImage[] =
        await productDB.getProductImagesByProductId(product.id);
      const imageUpdateList: (ProductImage | undefined)[] = productImages.map(
        (image: ProductImage) => {
          for (const imageUpdate of imagesUpdate) {
            if (image.id === imageUpdate.id) {
              return { ...image, isDefault: imageUpdate.isDefault };
            }
          }
        }
      );
      const imageUpdateListFilter: (ProductImage | undefined)[] =
        imageUpdateList.filter((image: ProductImage | undefined) => image);
      await productDB.updateProductImage(
        imageUpdateListFilter as ProductImage[]
      );
    }

    // upload new image if have some
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
        productImage.product = product;
        productImage.isDefault = image.isDefault;
        return productImage;
      })
    );
    productDB.addProductImage(imageList);

    // remove categories of product if have some
    const removeCategoriesList: ProductCategory[] = await Promise.all(
      removeCategories.map(async (category: any) => {
        const tmpProductCategory: ProductCategory | null =
          await productDB.getProductCategory(product.id, category.id);
        if (!tmpProductCategory) {
          return;
        }
        return tmpProductCategory;
      })
    );
    const removeCategoriesListFilter: ProductCategory[] =
      removeCategoriesList.filter(
        (productCategory: ProductCategory) => productCategory
      );
    await productDB.removeProductCategory(removeCategoriesListFilter);

    // add category to product if have some
    const updateCategoriesList: ProductCategory[] = await Promise.all(
      newCategories.map(async (category: any) => {
        const tmpcategory: Category | null = await categoryDB.getCategoryById(
          category.id
        );
        if (!tmpcategory) {
          return;
        }
        const tmpProductCategory: ProductCategory = new ProductCategory();
        tmpProductCategory.category = tmpcategory;
        tmpProductCategory.product = product;
        return tmpProductCategory;
      })
    );
    const updateCategoriesListFilter: ProductCategory[] =
      updateCategoriesList.filter(
        (productCategory: ProductCategory) => productCategory
      );
    await productDB.addProductCategory(updateCategoriesListFilter);

    const tmpProduct: Product = { ...product };
    tmpProduct.name = name;
    tmpProduct.description = description;
    tmpProduct.quantity = quantity;
    tmpProduct.price = price;
    await productDB.updateProduct(product.id, tmpProduct);
    res
      .status(200)
      .json({ status: "success", msg: "Updated product successfully" });
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
  updateProductDetail,
};
