import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";

import NavBar from "@/components/navbar";
import API from "@/config/axios.config";
import { SessionContext } from "@/context/session.context";

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
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAllowUrl, setIsAllowUrl] = useState(true);

  useEffect(() => {
    const authCheck = async (): Promise<any> => {
      try {
        const url = router.asPath;
        // if (routerCheck(url).localeCompare("no-need-login")) {
        //   setIsAllowUrl(true);
        //   return;
        // }
        const token = localStorage.getItem("token");
        if (!token) {
          // setIsLoggedIn(false);
          // setIsAllowUrl(true);
          // router.push("/login");
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const result = await API.get("/auth/session", config);
        setIsLoggedIn(result.data.isLoggedIn);
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
        <NavBar>
          <Component {...pageProps} />
        </NavBar>
      </SessionContext.Provider>
    </>
  ) : (
    <h1>haha</h1>
  );
}
