import { useState } from "react";
import Link from "next/link";
import { AxiosResponse } from "axios";

import { RegisterData } from "@/interface/UserData";
import { NotifyData } from "@/interface/NotifyData";
import Notify from "@/components/notify";
import API from "../config/axios.config";

const registerInfoDefault: RegisterData = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
};
const notifyDefault: NotifyData = { isFailed: false, msg: "" };

export default function Register(): React.ReactElement {
  const [registerInfo, setRegisterInfo] = useState(registerInfoDefault);
  const [notify, setNotify] = useState(notifyDefault);

  function handleFullnameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRegisterInfo({ ...registerInfo, fullName: e.target.value });
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRegisterInfo({ ...registerInfo, username: e.target.value });
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRegisterInfo({ ...registerInfo, email: e.target.value });
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setRegisterInfo({ ...registerInfo, password: e.target.value });
  }

  function handleRepeatPasswordChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setRegisterInfo({ ...registerInfo, repeatPassword: e.target.value });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    try {
      Object.values(registerInfo).forEach((value: string) => {
        if (value === null) {
          setRegisterInfo({
            ...registerInfo,
            password: "",
            repeatPassword: "",
          });
          return setNotify({
            isFailed: true,
            msg: "Please provide all required information",
          });
        }
      });

      if (registerInfo.password !== registerInfo.repeatPassword) {
        setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
        return setNotify({
          isFailed: true,
          msg: "Repeat password does not match the password",
        });
      }
      const result: AxiosResponse = await API.post(
        "/auth/register",
        registerInfo
      );
      setRegisterInfo(registerInfoDefault);
      setNotify({ isFailed: false, msg: result.data.msg });
    } catch (error: any) {
      setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
      setNotify({ isFailed: true, msg: error.response.data.msg });
    }
  }

  return (
    <div className="py-14 container max-h-screen max-w-2xl mx-auto">
      <div className="box-border h-auto w-auto p-4 border-4 rounded-xl bg-orange-400">
        <p className="text-center text-4xl font-bold text-neutral-500 mt-4 mb-8">
          Register
        </p>
        <form className="w-full max-w-md mx-auto my-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              placeholder="full name"
              value={registerInfo.fullName}
              onChange={handleFullnameChange}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-username"
              type="text"
              placeholder="username"
              value={registerInfo.username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div className="mb-6">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-email"
              type="email"
              placeholder="email"
              value={registerInfo.email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-password"
              type="password"
              placeholder="password"
              value={registerInfo.password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-4 italic">
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
          <div className="mb-3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-repeat-password"
              type="password"
              placeholder="repeat password"
              value={registerInfo.repeatPassword}
              onChange={handleRepeatPasswordChange}
              required
            />
          </div>
          {notify.isFailed ? <Notify color={"red"} msg={notify.msg} /> : null}
          {!notify.isFailed && notify.msg !== "" ? (
            <Notify color={"green"} msg={notify.msg} />
          ) : null}
          <div className="flex ml-1 mb-6 text-neutral-600">
            Already have account?
            <Link href="/login" className="ml-2 link">
              Login now.
            </Link>
            <Link href="/recovery" className="ml-16 link">
              Forgot password?
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
