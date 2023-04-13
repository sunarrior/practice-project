import { useState, useContext } from "react";
import { useRouter, NextRouter } from "next/router";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";

import { SessionContext } from "@/context/session.context";
import { AdminContext } from "@/context/admin.context";
import { LoginData, UserToken } from "@/interface/UserData";
import { NotifyData } from "@/interface/NotifyData";
import Notify from "@/components/notify";
import API from "../config/axios.config";

const loginInfoDefault: LoginData = { account: "", password: "" };
const notifyDefault: NotifyData = { isFailed: false, msg: "" };

export default function LoginForm(): React.ReactElement {
  const router: NextRouter = useRouter();
  const { setIsLoggedIn } = useContext(SessionContext);
  const { setIsAdmin } = useContext(AdminContext);
  const [loginInfo, setLoginInfo] = useState(loginInfoDefault);
  const [notify, setNotify] = useState(notifyDefault);

  function handleAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginInfo({ ...loginInfo, account: e.target.value });
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginInfo({ ...loginInfo, password: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const data: LoginData = { ...loginInfo };
      const result: AxiosResponse = await API.post("/auth/login", data);
      (setIsLoggedIn as any)(true);
      setLoginInfo(loginInfoDefault);
      setNotify(notifyDefault);
      const userObjDecode: UserToken = jwtDecode(
        result.data.user_obj.access_token
      );
      if (userObjDecode?.data?.role.localeCompare("admin") === 0) {
        (setIsAdmin as any)(true);
      }
      localStorage.setItem("_uob", JSON.stringify(result.data.user_obj));
      router.push("/");
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <div className="py-32 container max-h-screen max-w-2xl mx-auto">
      <div className="box-border h-auto w-auto p-4 border-4 rounded-xl bg-orange-400">
        <p className="text-center text-4xl font-bold text-neutral-500 mt-4 mb-8">
          Login Form
        </p>
        <form className="w-full max-w-md mx-auto my-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              name="account"
              placeholder="Account"
              value={loginInfo.account}
              onChange={handleAccountChange}
            />
          </div>
          <div className="mb-5">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-password"
              type="password"
              name="password"
              placeholder="Password"
              value={loginInfo.password}
              onChange={handlePasswordChange}
            />
          </div>
          {notify.isFailed ? <Notify color="red" msg={notify.msg} /> : null}
          <div className="flex justify-between mb-4">
            <Link href="/recovery" className="link">
              Forgot Password?
            </Link>
            <Link href="/register" className="link">
              Sign Up now
            </Link>
          </div>
          <div className="grid justify-items-center">
            <button
              className="shadow w-1/4 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
