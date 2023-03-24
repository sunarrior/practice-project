/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext } from "react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";

import { SessionContext } from "@/context/session.context";

function IsLoggedIn({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}): React.ReactElement {
  const userMenus = [
    { name: "Profile", url: "/profile" },
    { name: "Order History", url: "/order" },
    { name: "Logout", url: "/logout" },
  ];
  if (isLoggedIn) {
    return (
      <>
        <div className="justify-center md:block px-1 py-1 rounded-full bg-red-100 group-hover:bg-red-50 cursor-pointer group">
          <Link
            className="relative text-gray-700 group-hover:text-gray-500"
            href="#"
          >
            <AiOutlineShoppingCart size={20} />
            {/* <span className="absolute top-0 left-0 rounded-full bg-indigo-500 text-white p-1 text-xs"></span> */}
          </Link>
        </div>
        <div className="my-1 text-sm text-gray-700 font-medium mx-6 md:my-0">
          <Menu>
            <Menu.Button className="hover:text-indigo-500">
              <HiOutlineUserCircle size={30} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {userMenus.map((item: any) => (
                <Menu.Item key={item.name}>
                  <Link href={item.url}>
                    <button className="w-full rounded-md p-2 hover:bg-indigo-500 hover:text-gray-200">
                      {item.name}
                    </button>
                  </Link>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col md:flex-row mx-3 uppercase">
        <Link
          className="border-2 border-black rounded-full px-2 py-1 my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 mx-3 md:my-0"
          href="/register"
        >
          Sign Up
        </Link>
        <Link
          className="border-2 border-black rounded-full px-2 py-1 my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 mx-3 md:my-0"
          href="/login"
        >
          Login
        </Link>
      </div>
    </>
  );
}

export default function NavBar({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const { isLoggedIn, setIsLoggedIn } = useContext(SessionContext);

  return (
    <>
      {/* <!-- component --> */}
      <nav className="bg-white shadow">
        <div className="mx-auto px-11 py-3 flex justify-between md:items-center">
          <div className="flex justify-between items-center">
            <div>
              <Link
                className="text-gray-800 text-2xl font-bold hover:text-gray-700"
                href="/"
              >
                Brand
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:mx-6">
              <Link
                className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                href="/"
              >
                Home
              </Link>
              <Link
                className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                href="/category"
              >
                Category
              </Link>
              <Link
                className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                href="#"
              >
                Contact
              </Link>
              <Link
                className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                href="#"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <IsLoggedIn isLoggedIn={isLoggedIn as boolean} />
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
