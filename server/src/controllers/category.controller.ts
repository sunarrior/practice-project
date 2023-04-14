import { Request, Response } from "express";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.config";

import { common, categoryConstant } from "../constant/controller.constant";
import categoryDB from "../db/category.db";
import productDB from "../db/product.db";
import Category from "../entity/Category";
import Product from "../entity/Product";
import ProductCategory from "../entity/ProductCategory";
import ProductImage from "../entity/ProductImage";
import { CategoryData } from "../interface/CategoryData";
import { ProductData } from "../interface/ProductData";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories: Category[] = await categoryDB.getAllCategories();
    const categoryList: CategoryData[] = categories.map(
      (category: Category) => {
        const productCategoriesFilter: ProductCategory[] =
          category.productCategories.filter(
            (productCategory: ProductCategory) =>
              productCategory.product.isDelete === false
          );
        return {
          id: category.id,
          name: category.name,
          productQuantity: productCategoriesFilter.length,
          url: category.thumbnailUrl,
        };
      }
    );
    res.status(200).json({ categoryList });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id: categoryid } = req.params;
    const category: Category | null = await categoryDB.getCategoryById(
      categoryid as unknown as number
    );
    if (!category) {
      return res.status(404).json({ msg: categoryConstant.NOT_FOUND });
    }

    const productCategoriesFilter: ProductCategory[] =
      category.productCategories.filter(
        (productCategory: ProductCategory) =>
          productCategory.product.isDelete === false
      );
    const categoryInfo: CategoryData = {
      url: category.thumbnailUrl,
      name: category.name,
      productQuantity: productCategoriesFilter.length,
      description: category.description,
    };
    res.status(200).json({ categoryInfo });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result: Product[] = await productDB.getProductByCategory(
      id as unknown as number
    );
    const productList: (ProductData | undefined)[] = result.map(
      (product: Product) => {
        return {
          id: product?.id,
          name: product?.name,
          price: product?.price,
          url: product?.productImages?.filter(
            (image: ProductImage) => image.isDefault
          )[0]?.url,
        };
      }
    );
    const productListFilter: (ProductData | undefined)[] = productList.filter(
      (product: ProductData | undefined) => product !== undefined
    );
    res.status(200).json({ productList: productListFilter });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const addNewCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, filePath } = req.body;
    const category: Category = new Category();
    category.name = name;
    category.description = description;

    if (filePath.localeCompare("") !== 0) {
      // upload the new category image to cloudinary
      await cloudinary.uploader.upload(
        filePath,
        { folder: "category_img" },
        async (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          category.thumbnailUrl = result?.secure_url as string;
        }
      );
    }
    await categoryDB.addCategory(category);
    res.status(200).json({ msg: categoryConstant.ADD_SUSSESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, filePath } = req.body;

    const category: Category | null = await categoryDB.getCategoryById(
      id as unknown as number
    );
    if (!category) {
      return res.status(404).json({ msg: categoryConstant.NOT_FOUND });
    }
    category.name = name;
    category.description = description;

    if (filePath.localeCompare("") !== 0) {
      // remove old image and upload the new one to cloudinary
      const imagePID = category.thumbnailUrl.split("/")[8].split(".")[0];
      await cloudinary.uploader.destroy(`category_img/${imagePID}`);
      await cloudinary.uploader.upload(
        filePath,
        { folder: "category_img" },
        async (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          category.thumbnailUrl = result?.secure_url as string;
        }
      );
    }
    await categoryDB.addCategory(category);
    res.status(201).json({ msg: categoryConstant.UPDATE_SUSSESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const ids: number[] = req.body;
    const categories: (Category | undefined)[] = await Promise.all(
      ids.map(async (id: number) => {
        const category: Category | null = await categoryDB.getCategoryById(id);
        if (category) {
          return category;
        }
      })
    );

    for (let i = 0; i < categories.length; i += 1) {
      if (categories[i]) {
        if ((categories[i] as Category).productCategories.length > 0) {
          return res.status(400).json({
            msg: categoryConstant.STILL_HAVE_PRODUCT,
          });
        }
      }
    }

    const filterCategories: (Category | undefined)[] = categories.filter(
      (category: Category | undefined) =>
        category && category.productCategories.length === 0
    );
    await Promise.all(
      filterCategories.map(async (category: Category | undefined) => {
        if (category?.thumbnailUrl) {
          const imagePID = category?.thumbnailUrl.split("/")[8].split(".")[0];
          await cloudinary.uploader.destroy(`category_img/${imagePID}`);
        }
      })
    );
    await categoryDB.deleteCategory(filterCategories as Category[]);
    res.status(200).json({ msg: categoryConstant.DELETE_SUSSESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  getProductByCategory,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
