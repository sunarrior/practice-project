import { useRouter, NextRouter } from "next/router";
import { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { NotifyData } from "@/interface/NotifyData";
import API from "@/config/axios.config";

const notifyDefault: NotifyData = { isFailed: false, msg: "" };

export default function Verify(): React.ReactElement {
  const router: NextRouter = useRouter();
  const [notify, setNotify] = useState(notifyDefault);

  const { token } = router.query;

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        if (!token) {
          return;
        }
        const result: AxiosResponse = await API.post("/auth/verify", {
          token,
        });
        setNotify({ isFailed: false, msg: result.data.msg });
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
    })();
  }, [token]);

  return (
    <>
      <div className="py-20 container max-w-2xl mx-auto">
        <div className="box-border p-4 border-4 rounded-xl bg-orange-400">
          <div className="w-full">
            <p className="text-center text-2xl font-bold text-neutral-500 mt-4 mb-6">
              {notify.msg}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
