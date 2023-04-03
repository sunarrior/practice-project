import { Request, Response } from "express";
import cloudinary from "../config/cloudinary.config";

import categoryDB from "../db/category.db";
import Category from "../entity/Category";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result: Category[] = await categoryDB.getAllCategories();
    const categoryList = result.map((category: Category) => {
      return {
        id: category?.id,
        name: category?.name,
        productQuantity: category?.productCategories?.length,
        url: category?.thumbnailUrl,
      };
    });
    res.status(200).json({ status: "success", categoryList: categoryList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id: categoryid } = req.params;
    const result = await categoryDB.getCategoryById(
      categoryid as unknown as number
    );
    const categoryInfo = {
      url: result?.thumbnailUrl,
      name: result?.name,
      productQuantity: result?.productCategories?.length,
      description: result?.description,
    };
    res.status(200).json({ status: "success", categoryInfo: categoryInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const addNewCategory = async (req: Request, res: Response) => {
  try {
    if (req.role?.localeCompare("admin") !== 0) {
      return res
        .status(403)
        .json({ status: "failed", msg: "Authorized required action" });
    }

    const { name, description, filePath } = req.body;
    const category: Category = new Category();
    category.name = name;
    category.description = description;

    if (filePath.localeCompare("") !== 0) {
      // upload the new category image to cloudinary
      await cloudinary.uploader.upload(
        filePath,
        { folder: "category_img" },
        async (error: any, result: any) => {
          category.thumbnailUrl = result.secure_url;
        }
      );
    }
    await categoryDB.addCategory(category);
    res
      .status(200)
      .json({ status: "success", msg: "Add category successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    if (req.role?.localeCompare("admin") !== 0) {
      return res
        .status(403)
        .json({ status: "failed", msg: "Authorized required action" });
    }

    const { id, name, description, filePath } = req.body;
    if (!id) {
      return res
        .status(404)
        .json({ status: "failed", msg: "Category not found" });
    }

    const category: Category | null = await categoryDB.getCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", msg: "Category not found" });
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
        async (error: any, result: any) => {
          category.thumbnailUrl = result.secure_url;
        }
      );
    }
    await categoryDB.addCategory(category);
    res
      .status(200)
      .json({ status: "success", msg: "Update category successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  updateCategory,
};
