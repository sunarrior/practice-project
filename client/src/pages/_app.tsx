import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";

import NavBar from "@/components/navbar";
import API from "@/config/axios.config";
import { SessionContext } from "@/context/session.context";

function routerCheck(
  route: string,
  loginState: boolean,
  router: NextRouter
): void {
  const redirectIfLoggedIn: string[] = [
    "login",
    "register",
    "verify",
    "recovery",
  ];
  const redirectIfNotLoggedIn: string[] = [
    "profile",
    "logout",
    "order",
    "recovery",
  ];
  const routeName: string = route.split("/")[1];
  if (loginState) {
    if (redirectIfLoggedIn.includes(routeName)) {
      router.push("/");
    } else {
      router.push(route);
    }
  } else if (!loginState) {
    if (redirectIfNotLoggedIn.includes(routeName)) {
      router.push("/login");
    } else {
      router.push(route);
    }
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const url = router.asPath;

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          routerCheck(url, isLoggedIn, router);
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const result = await API.get("/auth/session", config);
        setIsLoggedIn(result.data.isLoggedIn);
        routerCheck(url, isLoggedIn, router);
      } catch (error: any) {
        // console.log(error);
        setIsLoggedIn(false);
        routerCheck(url, error.response.data.isLoggedIn, router);
      }
    })();
  }, [isLoggedIn, router, url]);

  return (
    <>
      <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </SessionContext.Provider>
    </>
  );
}
