import { UserData } from "./UserData";
import { AddCartData } from "./CartData";
import { PlaceOrderData, SelectedOrder, PaymentInfo } from "./OrderData";
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
    | PaymentInfo
    | AddCategoryData
    | ProductDataModal
    | number[];
  onUploadProgress?: (progressEvent: any) => void;
}
