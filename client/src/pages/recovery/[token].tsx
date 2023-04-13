import React, { useState, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { NotifyData } from "@/interface/NotifyData";
import { RecoveryData } from "@/interface/UserData";
import API from "@/config/axios.config";
import Notify from "@/components/notify";

const passwordInfoDefault: RecoveryData = { password: "", repeatPassword: "" };
const notifyDefault: NotifyData = { isFailed: false, msg: "" };

export default function FindAccount(): React.ReactElement {
  const router: NextRouter = useRouter();
  const [notify, setNotify] = useState(notifyDefault);
  const [password, setPassword] = useState(passwordInfoDefault);

  const recoveryToken: string | string[] | undefined = router.query.token;

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        if (!recoveryToken) {
          return;
        }

        const result: AxiosResponse = await API.post(
          "/auth/recovery?checktoken=1",
          {
            token: recoveryToken,
          }
        );
        setNotify({ ...notifyDefault, msg: result.data.msg });
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
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
      const result: AxiosResponse = await API.post(
        "/auth/recovery?changepass=1",
        {
          token: recoveryToken,
          password: password.password,
        }
      );
      setPassword(passwordInfoDefault);
      setNotify({ ...notifyDefault, msg: result.data.msg });
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      setNotify({
        isFailed: true,
        msg: error.response?.data?.msg || error.message,
      });
    }
  }

  return (
    <>
      <div className="py-32 container max-w-2xl mx-auto">
        <div className="box-border w-auto p-4 border-4 rounded-xl bg-orange-400">
          <p className="text-center text-4xl font-bold text-neutral-500 mt-4 mb-8">
            Change Password
          </p>
          <form
            className="w-full max-w-md mx-auto my-6"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
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
            <div className="mb-5 italic">
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
            <div className="mb-4">
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
