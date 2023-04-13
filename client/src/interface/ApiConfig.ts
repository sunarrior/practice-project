import { UserData } from "./UserData";
import { AddCartData, PlaceOrderData } from "./CartData";
import { SelectedOrder } from "./OrderData";
import { AddCategoryData } from "./CategoryData";
import { ProductDataModal } from "./ProductData";

export interface ApiConfig {
  headers: {
    Authorization: string;
  };
  data?:
    | UserData
    | AddCartData
    | PlaceOrderData
    | SelectedOrder
    | AddCategoryData
    | ProductDataModal
    | number[];
  onUploadProgress?: (progressEvent: any) => void;
}
