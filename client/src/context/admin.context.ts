/* eslint-disable import/prefer-default-export */
import { createContext, Context, Dispatch, SetStateAction } from "react";

type IsAdmin = {
  isAdmin?: boolean;
  setIsAdmin?: Dispatch<SetStateAction<boolean>>;
};
const obj: IsAdmin = {};
export const AdminContext: Context<IsAdmin> = createContext(obj);
