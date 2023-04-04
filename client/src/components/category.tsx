import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import { AdminContext } from "@/context/admin.context";

export default function Category({
  url,
  categoryId,
  categoryName,
  productQuantity,
  checkedItem,
  handleCheckboxChange,
}: {
  url: string;
  categoryId: number;
  categoryName: string;
  productQuantity: number;
  checkedItem: boolean;
  handleCheckboxChange: (id: number) => void;
}) {
  const { isAdmin } = useContext(AdminContext);
  return (
    <>
      <div className="relative mr-4 my-5 bg-orange-300 w-[248px] max-w-sm rounded-md overflow-hidden shadow-lg">
        {isAdmin && (
          <div className="z-30 absolute top-1 left-2">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-md"
              onChange={() => handleCheckboxChange(categoryId)}
              checked={checkedItem}
            />
          </div>
        )}
        <Link key={categoryId} href={`/category/${categoryId}`}>
          <Image
            className="w-full h-44 object-cover"
            src={url}
            alt={categoryName}
            width={500}
            height={500}
          />
          <div className="px-6 py-2">
            <div className="font-bold text-xl mb-2 uppercase">
              {categoryName}
            </div>
            <p className="text-gray-700 text-base">
              Quantity: {productQuantity}
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
