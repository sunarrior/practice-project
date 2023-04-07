/* eslint-disable import/no-extraneous-dependencies */
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { SessionContext } from "@/context/session.context";
import { AdminContext } from "@/context/admin.context";
import jwtDecode from "jwt-decode";

import Notify from "@/components/notify";
import { toast } from "react-toastify";
import API from "../config/axios.config";

const loginInfoDefault = { account: "", password: "" };
const notifyDefault = { isFailed: false, msg: "" };

export default function LoginForm() {
  const router = useRouter();
  const { setIsLoggedIn } = useContext(SessionContext);
  const { setIsAdmin } = useContext(AdminContext);
  const [loginInfo, setLoginInfo] = useState(loginInfoDefault);
  const [notify, setNotify] = useState(notifyDefault);

  function handleAccountChange(e: any) {
    setLoginInfo({ ...loginInfo, account: e.target.value });
  }

  function handlePasswordChange(e: any) {
    setLoginInfo({ ...loginInfo, password: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const data = { ...loginInfo };
      const result = await API.post("/auth/login", data);
      if (result.data.status === "failed") {
        return setNotify({ isFailed: true, msg: result.data.msg });
      }
      (setIsLoggedIn as any)(true);
      setLoginInfo(loginInfoDefault);
      setNotify(notifyDefault);
      const userObjDecode: any = jwtDecode(result.data.user_obj.access_token);
      if (userObjDecode?.data?.role.localeCompare("admin") === 0) {
        (setIsAdmin as any)(true);
      }
      localStorage.setItem("_uob", JSON.stringify(result.data.user_obj));
      router.push("/");
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
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
          <div className="flex px-4 mb-4 items-center">
            <input
              className="w-4 h-4 leading-tight rounded-lg"
              type="checkbox"
            />
            <label className="ml-2 text-gray-500 text-sm font-medium">
              Remenber me
            </label>
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
