import { UserData } from "./UserData";
import { AddCartData } from "./CartData";

export interface ApiConfig {
  headers: {
    Authorization: string;
  };
  data?: UserData | AddCartData | number[];
  onUploadProgress?: (progressEvent: any) => void;
}
