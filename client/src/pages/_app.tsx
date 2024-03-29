import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";

import { SessionContext } from "@/context/session.context";
import { AdminContext } from "@/context/admin.context";
import { CartContext } from "@/context/cart.context";
import { UserToken } from "@/interface/UserData";
import NavBar from "@/components/navbar";
import API from "@/config/axios.config";

function routerCheck(route: string): string {
  const redirectIfLoggedIn: string[] = [
    "login",
    "register",
    "verify",
    "recovery",
  ];
  const needLoggedIn: string[] = ["profile", "logout", "order", "recovery"];
  const routeName: string = route.split("/")[1];
  if (needLoggedIn.includes(routeName)) {
    return "need-login";
  }
  return "no-need-login";
}

export default function App({ Component, pageProps }: AppProps) {
  const router: NextRouter = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartState, setCartState] = useState(0);
  const [isAllowUrl, setIsAllowUrl] = useState(true);

  useEffect(() => {
    const authCheck = async (): Promise<any> => {
      try {
        const url = router.asPath;
        // if (routerCheck(url).localeCompare("no-need-login")) {
        //   setIsAllowUrl(true);
        //   return;
        // }
        const userObj = JSON.parse(localStorage.getItem("_uob") as any);
        if (!userObj) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        const result: AxiosResponse = await API.get("/auth/session", config);
        setIsLoggedIn(result.data.isLoggedIn);
        setCartState(result.data.cartState);
        const userObjDecode: UserToken = jwtDecode(userObj?.access_token);
        if (userObjDecode?.data?.role.localeCompare("admin") === 0) {
          setIsAdmin(true);
        }
        // router.push("/login");
      } catch (error: any) {
        // console.log(error);
        setIsLoggedIn(false);
      }
    };

    authCheck();

    // const preventAccess = () => setIsAllowUrl(false);

    // router.events.on("routeChangeStart", preventAccess);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      // router.events.off("routeChangeStart", preventAccess);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, router.events]);

  return isAllowUrl ? (
    <>
      <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
          <CartContext.Provider value={{ cartState, setCartState }}>
            <NavBar>
              <Component {...pageProps} />
            </NavBar>
          </CartContext.Provider>
        </AdminContext.Provider>
      </SessionContext.Provider>
      <ToastContainer />
    </>
  ) : (
    <h1>haha</h1>
  );
}
