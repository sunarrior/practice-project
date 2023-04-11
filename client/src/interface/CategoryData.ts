export interface CategoryData {
  id?: number;
  name: string;
  productQuantity: number | undefined;
  description?: string;
  url: string | undefined;
}

export interface AddCategoryData {
  categoryName: string;
  description: string;
}
