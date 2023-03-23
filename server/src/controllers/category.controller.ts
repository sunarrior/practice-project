import { Request, Response } from "express";

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

export default {
  getAllCategories,
  getCategoryById,
};
