import React, { useState } from "react";

import API from "@/config/axios.config";
import Notify from "@/components/notify";

const accountInfoDefault = "";
const notifyDefault = { isFailed: false, msg: "" };

export default function FindAccount(): React.ReactElement {
  const [notify, setNotify] = useState(notifyDefault);
  const [account, setAccount] = useState(accountInfoDefault);

  function handleAccountChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setAccount(e.target.value);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    try {
      e.preventDefault();
      const result = await API.post("/auth/recovery?findaccount=1", {
        account,
      });
      if (result.data.status === "success") {
        setAccount(accountInfoDefault);
        setNotify({ ...notifyDefault, msg: result.data.msg });
      } else {
        setNotify({ isFailed: true, msg: result.data.msg });
      }
    } catch (error: any) {
      setNotify({ isFailed: true, msg: error.response.data.msg });
    }
  }

  return (
    <>
      <div className="py-44 container max-w-2xl mx-auto">
        <div className="box-border w-auto p-4 border-4 rounded-xl bg-orange-400">
          <p className="text-center text-4xl font-bold text-neutral-500 mt-4 mb-8">
            Find Account
          </p>
          <form
            className="w-full max-w-md mx-auto my-6"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-account"
                type="text"
                name="account"
                placeholder="Username or Email"
                value={account}
                onChange={handleAccountChange}
              />
            </div>
            {notify.isFailed ? <Notify color="red" msg={notify.msg} /> : null}
            {!notify.isFailed && notify.msg !== "" ? (
              <Notify color={"green"} msg={notify.msg} />
            ) : null}
            <div className="grid justify-items-center">
              <button
                className="shadow w-1/4 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Check
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
