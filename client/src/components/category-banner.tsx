/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import Image from "next/image";

import { AdminContext } from "@/context/admin.context";

export default function Banner({
  url,
  categoryName,
  productQuantity,
  description,
  handleShowModal,
}: {
  url: string;
  categoryName: string;
  productQuantity: number;
  description: string;
  handleShowModal: (state: boolean) => void;
}) {
  const { isAdmin, setIsAdmin } = useContext(AdminContext);

  return (
    <>
      <div
        id="banner"
        className="flex max-w-full mx-52 py-3 px-4 bg-orange-400 border border-b border-gray-200 rounded-md"
      >
        <Image
          className="w-1/4 h-52 object-cover"
          src={url}
          alt={categoryName}
          width={500}
          height={500}
        />
        <div className="flex-none relative w-3/4">
          <p className="text-lg font-bold ml-5 mb-3 uppercase">
            {categoryName}
          </p>
          <p className="text-md font-bold ml-5 mb-3">
            PRODUCT QUANTITY: {productQuantity}
          </p>
          <p className="text-md text-justify ml-5">{description}</p>
          {isAdmin && (
            <div className="absolute bottom-0 right-0">
              <button
                className="px-6 py-2 rounded-md bg-purple-500 hover:bg-purple-400 font-bold text-white"
                onClick={() => handleShowModal(true)}
              >
                Edit Category
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
