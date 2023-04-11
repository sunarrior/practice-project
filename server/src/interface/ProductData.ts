export interface ProductImageData {
  id: number;
  url: string;
  isDefault: boolean;
}

export interface ProductCategoryData {
  id: number;
  name: string;
}

export interface ProductData {
  id: number;
  name: string;
  price: number;
  url: string | undefined;
  categories?: (string | undefined)[];
}

export interface ProductDetail {
  name: string;
  quantity: number;
  price: number;
  description: string;
  imageList: (ProductImageData | undefined)[];
  categories: ProductCategoryData[];
}
