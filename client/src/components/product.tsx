import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import { AdminContext } from "@/context/admin.context";

export default function Product({
  id,
  url,
  productName,
  price,
  checked,
  handleProductSelectChange,
}: {
  id: number;
  url: string;
  productName: string;
  price: number;
  checked: boolean;
  handleProductSelectChange: (key: number) => void;
}) {
  const { isAdmin } = useContext(AdminContext);
  return (
    <>
      <div className="relative mr-4 my-5 bg-orange-400 w-60 max-w-sm rounded-md overflow-hidden shadow-md">
        {isAdmin && (
          <div className="absolute top-2 left-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-md"
              checked={checked}
              onChange={() => handleProductSelectChange(id)}
            />
          </div>
        )}
        <div onClick={() => handleProductSelectChange(id)}>
          <Image
            className="w-full h-44 object-cover"
            src={url}
            alt={productName}
            width={500}
            height={500}
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{productName}</div>
            <p className="text-gray-700 text-base">{price}$</p>
          </div>
        </div>
        <div className="px-6 pt-2 pb-2">
          <Link href={`/product/${id}`}>
            <button className="font-bold w-full mb-3 py-2 bg-purple-500 hover:bg-purple-400 rounded-md">
              VIEW DETAIL
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
