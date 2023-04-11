import { useEffect, useContext } from "react";
import { useRouter, NextRouter } from "next/router";

import { SessionContext } from "@/context/session.context";
import { AdminContext } from "@/context/admin.context";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import API from "@/config/axios.config";
import { toast } from "react-toastify";

export default function Logout(): void {
  const router: NextRouter = useRouter();
  const { setIsLoggedIn } = useContext(SessionContext);
  const { setIsAdmin } = useContext(AdminContext);
  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        const userObj: UserObjectLS = JSON.parse(
          localStorage.getItem("_uob") as any
        );
        if (!userObj) {
          return;
        }
        const config: ApiConfig = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        await API.get("/auth/logout", config);
        localStorage.removeItem("_uob");
        (setIsAdmin as any)(false);
        (setIsLoggedIn as any)(false);
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
    })();
  }, [setIsAdmin, setIsLoggedIn]);

  // router.reload();
  router.push("/");
}
