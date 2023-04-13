import { createContext, Context, Dispatch, SetStateAction } from "react";

type Session = {
  isLoggedIn?: boolean;
  setIsLoggedIn?: Dispatch<SetStateAction<boolean>>;
};
const obj: Session = {};
export const SessionContext: Context<Session> = createContext(obj);
