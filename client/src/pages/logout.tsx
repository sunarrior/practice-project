/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { SessionContext } from "@/context/session.context";
import API from "@/config/axios.config";

export default function Logout() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useContext(SessionContext);
  useEffect(() => {
    (async () => {
      try {
        const userObj = JSON.parse(localStorage.getItem("_uob") as any);
        if (!userObj) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        const result = await API.get("/auth/logout", config);
        if (result.data.status === "success") {
          localStorage.removeItem("token");
          (setIsLoggedIn as any)(false);
        }
      } catch (error) {
        // console.log(error);
      }
    })();
  }, [setIsLoggedIn]);

  // router.reload();
  router.push("/");
}
