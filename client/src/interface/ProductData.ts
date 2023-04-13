import { CategoryData } from "./CategoryData";

export interface ProductData {
  id: number;
  name: string;
  price: number;
  url: string | undefined;
  categories?: (string | undefined)[];
}

export interface ProductImageData {
  id: number;
  url: string;
  isDefault: boolean;
}

export interface ProductCategoryData {
  id: number;
  name: string;
}

export interface ProductDetailData {
  productId: number;
  productName: string;
  productQuantity: number;
  price: number;
  description?: string | undefined;
  imageList?: (ProductImageData | undefined)[];
  categories?: ProductCategoryData[];
}

export interface AddProductData {
  productName: string;
  quantity: number;
  price: number;
  description: string;
}

export interface ProductDataModal {
  id?: number;
  name: string;
  removeCategories?: ProductCategoryData[];
  newCategories: CategoryData[];
  description: string;
  quantity: number;
  price: number;
  filesPath: ProductImageData[];
  imagesUpdate?: ProductImageData[];
  imagesRemove?: ProductImageData[];
}
