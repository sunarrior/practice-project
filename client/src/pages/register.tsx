import { useState } from "react";
import Notify from "@/components/notify";
// import { redirect } from "next/navigation";
import API from "../config/axios.config";

const registerInfoDefault = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
};
const notifyDefault = { isFailed: false, msg: "" };

export default function Register() {
  const [registerInfo, setRegisterInfo] = useState(registerInfoDefault);
  const [notify, setNotify] = useState(notifyDefault);

  function handleFullnameChange(e: any) {
    setRegisterInfo({ ...registerInfo, fullName: e.target.value });
  }

  function handleUsernameChange(e: any) {
    setRegisterInfo({ ...registerInfo, username: e.target.value });
  }

  function handleEmailChange(e: any) {
    setRegisterInfo({ ...registerInfo, email: e.target.value });
  }

  function handlePasswordChange(e: any) {
    setRegisterInfo({ ...registerInfo, password: e.target.value });
  }

  function handleRepeatPasswordChange(e: any) {
    setRegisterInfo({ ...registerInfo, repeatPassword: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const data: { [index: string]: string } = { ...registerInfo };

    for (const index in data) {
      if (data[index] === null) {
        setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
        return setNotify({
          isFailed: true,
          msg: "Please provide all required information",
        });
      }
    }

    if (data.password !== data.repeatPassword) {
      setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
      return setNotify({
        isFailed: true,
        msg: "Repeat password does not match the password",
      });
    }

    try {
      const result = await API.post("/auth/register", data);
      if (result.data.status === "failed") {
        setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
        return setNotify({ isFailed: true, msg: result.data.msg });
      }
      setRegisterInfo(registerInfoDefault);
      setNotify({ isFailed: false, msg: result.data.msg });
    } catch (error: any) {
      setRegisterInfo({ ...registerInfo, password: "", repeatPassword: "" });
      return setNotify({ isFailed: true, msg: error.message });
    }
    // redirect("/");
  }

  // function handleNotify() {
  //   // if (notify.isFailed) {
  //   //   return <Notify color="red" msg={notify.msg} />;
  //   // }
  //   // if (!notify.isFailed && notify.msg !== "") {
  //   //   return <Notify color="green" msg={notify.msg} />;
  //   // }
  // }

  return (
    <div className="py-20 container max-h-screen max-w-2xl mx-auto">
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
          <div className="mb-6">
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
          <div className="mb-5">
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
