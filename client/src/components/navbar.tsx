import React, { useContext } from "react";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineUserCircle } from "react-icons/hi";

import { SessionContext } from "@/context/session.context";
import { AdminContext } from "@/context/admin.context";
import { CartContext } from "@/context/cart.context";

function IsLoggedIn({
  isLoggedIn,
  cartState,
}: {
  isLoggedIn: boolean;
  cartState: number;
}): React.ReactElement {
  const userMenus = [
    { name: "Profile", url: "/profile" },
    { name: "Payment Method", url: "/payment" },
    { name: "Order History", url: "/orders" },
    { name: "Logout", url: "/logout" },
  ];
  if (isLoggedIn) {
    return (
      <>
        <div className="justify-center md:block px-1 py-1 rounded-full bg-red-100 group-hover:bg-red-50 cursor-pointer group">
          <Link
            className="relative text-gray-700 group-hover:text-gray-500"
            href="/cart"
          >
            <AiOutlineShoppingCart size={20} />
            <span className="absolute -top-2 -right-3 rounded-full bg-indigo-500 px-[4px] text-white text-xs">
              {cartState}
            </span>
          </Link>
        </div>
        <div className="z-50 my-1 text-sm text-gray-700 font-medium mx-6 md:my-0">
          <Menu>
            <Menu.Button className="hover:text-indigo-500">
              <HiOutlineUserCircle size={30} />
            </Menu.Button>
            <Menu.Items className="absolute right-0 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
  const { isLoggedIn } = useContext(SessionContext);
  const { isAdmin } = useContext(AdminContext);
  const { cartState } = useContext(CartContext);

  return (
    <>
      {/* <!-- component --> */}
      <div className="relative">
        <div className="fixed z-40 top-0 w-full">
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
                    href="/categories"
                  >
                    Category
                  </Link>
                  <Link
                    className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                    href="/"
                  >
                    Contact
                  </Link>
                  <Link
                    className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                    href="/"
                  >
                    About
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                        href="/admin/users"
                      >
                        User List
                      </Link>
                      <Link
                        className="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
                        href="/admin/orders"
                      >
                        Order List
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <IsLoggedIn
                  isLoggedIn={isLoggedIn as boolean}
                  cartState={cartState as number}
                />
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div className="mt-20">{children}</div>
    </>
  );
}
