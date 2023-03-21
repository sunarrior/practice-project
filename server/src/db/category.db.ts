import { dataSource } from "../config/data-source.config";
import Category from "../entity/Category";

const categoryRepos = dataSource.getRepository(Category);

const getAllCategories = async (): Promise<Category[]> => {
  const result = await categoryRepos.find({
    relations: {
      productCategories: {
        product: true,
      },
    },
  });
  return result;
};

const getCategoryById = async (
  categoryid: number
): Promise<Category | null> => {
  const result: Category | null = await categoryRepos.findOne({
    relations: {
      productCategories: {
        product: true,
      },
    },
    where: {
      id: categoryid,
    },
  });
  return result;
};

export default {
  getAllCategories,
  getCategoryById,
};
