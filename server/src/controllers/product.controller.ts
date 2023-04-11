import { Request, Response } from "express";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import cloudinary from "../config/cloudinary.config";
import productDB from "../db/product.db";
import categoryDB from "../db/category.db";
import cartDB from "../db/cart.db";
import Product from "../entity/Product";
import Category from "../entity/Category";
import ProductCategory from "../entity/ProductCategory";
import ProductImage from "../entity/ProductImage";
import CartItem from "../entity/CartItem";
import {
  ProductCategoryData,
  ProductData,
  ProductDetail,
  ProductImageData,
} from "../interface/ProductData";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result: Product[] = await productDB.getAllProducts();
    const productList: (ProductData | undefined)[] = result.map(
      (product: Product) => {
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
    );
    const productListFilter: (ProductData | undefined)[] = productList.filter(
      (product: any) => product !== undefined
    );
    res.status(200).json({ productList: productListFilter });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getProductDetail = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;
    const product: Product | null = await productDB.getProductDetail(
      productId as unknown as number,
      true
    );
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    const productDetail: ProductDetail = {
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      description: product.description,
      imageList: product.productImages?.map((image: ProductImage) => {
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
    res.status(200).json({ productDetail });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, newCategories, description, quantity, price, filesPath } =
      req.body;
    const product: Product = new Product();
    product.name = name;
    product.description = description;
    product.quantity = quantity;
    product.price = price;

    const categoryList: Category[] = await Promise.all(
      newCategories.map(async (category: ProductCategoryData) => {
        const tmpcategory: Category | null = await categoryDB.getCategoryById(
          category.id
        );
        return tmpcategory;
      })
    );
    const newProduct: Product = await productDB.addProduct(product);
    const productCategories: ProductCategory[] = categoryList.map(
      (category: Category) => {
        const productCategory: ProductCategory = new ProductCategory();
        productCategory.product = newProduct;
        productCategory.category = category;
        return productCategory;
      }
    );
    await productDB.addProductCategory(productCategories);
    const imageList: ProductImage[] = await Promise.all(
      filesPath.map(async (image: ProductImageData) => {
        const productImage: ProductImage = new ProductImage();
        await cloudinary.uploader.upload(
          image.url,
          { folder: "product_img" },
          async (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            productImage.url = result?.secure_url as string;
          }
        );
        productImage.product = newProduct;
        productImage.isDefault = image.isDefault;
        return productImage;
      })
    );
    await productDB.addProductImage(imageList);
    res.status(200).json({ msg: "Added product successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const updateProductDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
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
    const product: Product | null = await productDB.getProductById(
      id as unknown as number
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // remove image if have some
    const imageRemoveList: ProductImage[] = await Promise.all(
      imagesRemove.map(async (image: ProductImageData) => {
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
          imagesUpdate.forEach((imageUpdate: ProductImageData) => {
            if (image.id === imageUpdate.id) {
              return { ...image, isDefault: imageUpdate.isDefault };
            }
          });
          return undefined;
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
      filesPath.map(async (image: ProductImageData) => {
        const productImage: ProductImage = new ProductImage();
        await cloudinary.uploader.upload(
          image.url,
          { folder: "product_img" },
          async (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            productImage.url = result?.secure_url as string;
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
      removeCategories.map(async (category: ProductCategoryData) => {
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
      newCategories.map(async (category: ProductCategoryData) => {
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
    res.status(200).json({ msg: "Updated product successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const remmoveProducts = async (req: Request, res: Response) => {
  try {
    const ids: number[] = req.body;
    const products: (Product | undefined)[] = await Promise.all(
      ids.map(async (id: number) => {
        const product: Product | null = await productDB.getProductById(id);
        if (!product) {
          return;
        }
        return { ...product, isDelete: true };
      })
    );
    const productsFilter: (Product | undefined)[] = products.filter(
      (product: Product | undefined) => product
    );

    // check if product live in some cart
    productsFilter.forEach(async (product: Product | undefined) => {
      // eslint-disable-next-line no-await-in-loop
      const cartItems: CartItem[] = await cartDB.getCartItemsByProductId(
        product?.id as number
      );
      if (cartItems.length > 0) {
        return res.status(400).json({
          status: "failed",
          msg: "This product has in cart of users",
        });
      }
    });

    await productDB.removeProducts(productsFilter as Product[]);
    res.status(200).json({ msg: "Removed products successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export default {
  getAllProducts,
  getProductDetail,
  addProduct,
  updateProductDetail,
  remmoveProducts,
};
