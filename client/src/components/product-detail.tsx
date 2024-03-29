import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  BsCartPlus,
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

import { AdminContext } from "@/context/admin.context";
import { ProductImageData, ProductCategoryData } from "@/interface/ProductData";
import CategoryTag from "@/components/category-tag";
import ProductModalForm from "./admin-product-modal";

export default function ProductDetail({
  productId,
  productName,
  productQuantity,
  price,
  description = "",
  imageList = [],
  categories = [],
  purchaseAmount,
  onIncrease,
  onDecrease,
  onPurchaseAmountChange,
  onAddToCart,
}: {
  productId: number;
  productName: string;
  productQuantity: number;
  price: number;
  description?: string | undefined;
  imageList?: (ProductImageData | undefined)[];
  categories?: (ProductCategoryData | undefined)[];
  purchaseAmount: number;
  onIncrease: React.MouseEventHandler<HTMLButtonElement>;
  onDecrease: React.MouseEventHandler<HTMLButtonElement>;
  onPurchaseAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onAddToCart: React.MouseEventHandler<HTMLButtonElement>;
}): React.ReactElement {
  const router = useRouter();
  const { isAdmin } = useContext(AdminContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  function prevImage(): void {
    if (currentIndex === 0) {
      return setCurrentIndex(imageList.length - 1);
    }
    setCurrentIndex(currentIndex - 1);
  }

  function nextImage(): void {
    if (currentIndex === imageList.length - 1) {
      return setCurrentIndex(0);
    }
    setCurrentIndex(currentIndex + 1);
  }

  function goToSide(index: any): void {
    setCurrentIndex(index);
  }

  function handleShowModal(state: boolean): void {
    setShowModal(state);
  }

  function handleEditProduct(): void {
    router.reload();
  }

  return (
    <>
      {showModal && (
        <ProductModalForm
          isEdit={true}
          currentData={{
            productId,
            imagesPreview: imageList[0]?.id === 0 ? [] : imageList,
            productName,
            categories,
            description,
            quantity: productQuantity,
            price,
          }}
          handleShowModal={handleShowModal}
          onProductAction={handleEditProduct}
        />
      )}
      <div className="mx-52 my-10">
        <div className="flex max-w-full w-full h-96 py-3 px-4 bg-orange-400 border border-b border-gray-200 rounded-md">
          <div className="w-1/3 relative group">
            <Image
              className="rounded-md w-full h-52 object-cover bg-center bg-cover"
              src={imageList[currentIndex]?.url || "/blank-image.jpg"}
              alt={productName}
              width={500}
              height={500}
            />
            <div className="hidden group-hover:block absolute top-[30%] -translate-x-0 translate-y-[-50%] left-5 text-xl rounded-full p2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactLeft onClick={prevImage} size={25} />
            </div>
            <div className="hidden group-hover:block absolute top-[30%] -translate-x-0 translate-y-[-50%] right-5 text-xl rounded-full p2 bg-black/20 text-white cursor-pointer">
              <BsChevronCompactRight onClick={nextImage} size={25} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {imageList.map((image, imageIndex) => {
                return (
                  <div
                    className="text-2xl text-gray-600 cursor-pointer"
                    key={imageIndex}
                  >
                    <RxDotFilled onClick={() => goToSide(imageIndex)} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-none relative w-2/3 ml-5">
            <p className="text-lg font-bold mb-3 uppercase">{productName}</p>
            <p className="text-md font-bold mb-3">
              PRODUCT QUANTITY: {productQuantity}
            </p>
            <p className="text-md font-bold mb-3">PRICE: {price}$</p>
            <div className="flex text-md font-bold mb-3 uppercase">
              CATEGORY:{" "}
              {categories.map(
                (category: any) => (
                  <CategoryTag key={category.id} category={category.name} />
                ),
                ""
              )}
            </div>
            <p className="text-md text-justify mb-5">{description}</p>
            <div className="h-10 w-32 mt-[70px] mb-3">
              <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                <button
                  className="pb-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                  onClick={onDecrease}
                >
                  <span className="m-auto text-2xl font-thin">-</span>
                </button>
                <input
                  type="text"
                  className="focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black flex items-center text-gray-700 outline-none"
                  value={purchaseAmount}
                  onChange={onPurchaseAmountChange}
                />
                <button
                  className="pb-1 bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                  onClick={onIncrease}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <button
              className="flex px-4 py-2 bg-purple-500 border border-white hover:bg-purple-400 text-white font-bold rounded-md"
              type="button"
              onClick={onAddToCart}
            >
              <BsCartPlus className="mr-2" size={20} /> ADD TO CART
            </button>
            {isAdmin && (
              <button
                className="absolute bottom-2 right-2 px-6 py-2 bg-purple-500 hover:bg-purple-400 rounded-md font-bold text-white"
                onClick={() => handleShowModal(true)}
              >
                Edit Product
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
