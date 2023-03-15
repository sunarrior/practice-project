import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import API from "@/config/axios.config";
import Notify from "@/components/notify";

const passwordInfoDefault = { password: "", repeatPassword: "" };
const notifyDefault = { isFailed: false, msg: "" };

export default function FindAccount(): React.ReactElement {
  const router = useRouter();
  const [notify, setNotify] = useState(notifyDefault);
  const [password, setPassword] = useState(passwordInfoDefault);

  const recoveryToken = router.query.token;

  useEffect(() => {
    (async () => {
      if (recoveryToken !== undefined) {
        const result = await API.post("/auth/recovery?checktoken=1", {
          token: recoveryToken,
        });
        if (result.data.status === "success") {
          setNotify({ ...notifyDefault, msg: result.data.msg });
        } else {
          setNotify({ isFailed: true, msg: result.data.msg });
        }
      }
    })();
  }, [recoveryToken]);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setPassword({ ...password, password: e.target.value });
  }

  function handleRepeatPasswordChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPassword({ ...password, repeatPassword: e.target.value });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    try {
      e.preventDefault();
      const result = await API.post("/auth/recovery?changepass=1", {
        token: recoveryToken,
        password: password.password,
      });
      if (result.data.status === "success") {
        setPassword(passwordInfoDefault);
        setNotify({ ...notifyDefault, msg: result.data.msg });
        setTimeout(() => {
          router.push("/");
        }, 1500);
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
            Change Password
          </p>
          <form
            className="w-full max-w-md mx-auto my-6"
            onSubmit={handleSubmit}
          >
            <div className="mb-6">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-new-password"
                type="password"
                name="password"
                placeholder="password"
                value={password.password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="mb-5">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-repeat-new-password"
                type="password"
                name="repeatPassword"
                placeholder="repeat password"
                value={password.repeatPassword}
                onChange={handleRepeatPasswordChange}
              />
            </div>
            {notify.isFailed ? <Notify color="red" msg={notify.msg} /> : null}
            {!notify.isFailed && notify.msg !== "" ? (
              <Notify color={"green"} msg={notify.msg} />
            ) : null}
            <div className="mb-6 italic">
              <ul className="ml-5 list-disc text-neutral-700">
                <li>Password must at least 8 character</li>
                <li>Password must contain at least one uppercase character</li>
                <li>Password must contain at least one number</li>
                <li>
                  Password must contain at least one special character{" "}
                  {"(!, @, #, $, %, ^, &)"}
                </li>
              </ul>
            </div>
            <div className="grid justify-items-center">
              <button
                className="shadow w-1/4 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
