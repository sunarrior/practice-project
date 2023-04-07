import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import API from "@/config/axios.config";
import { toast } from "react-toastify";

const notifyDefault = { isFailed: false, msg: "" };

export default function Verify() {
  const router = useRouter();
  const [notify, setNotify] = useState(notifyDefault);

  const verifyToken = router.query.token;

  useEffect(() => {
    (async () => {
      try {
        if (verifyToken !== undefined) {
          const result = await API.post("/auth/verify", { token: verifyToken });
          if (result.data.status === "failed") {
            return setNotify({ isFailed: true, msg: result.data.msg });
          }
          return setNotify({ isFailed: false, msg: result.data.msg });
        }
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
    })();
  }, [verifyToken]);

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
