/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  BsCartPlus,
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

import CategoryTag from "@/components/category-tag";

export default function ProductDetail({
  productName,
  productQuantity,
  price,
  description,
  imageList,
  categories,
  purchaseAmount,
  handleIncrease,
  handleDecrease,
  handlePurchaseAmountChange,
  handleAddToCart,
}: {
  productName: string;
  productQuantity: number;
  price: number;
  description: string;
  imageList: [];
  categories: [];
  purchaseAmount: number;
  handleIncrease: React.MouseEventHandler<HTMLButtonElement>;
  handleDecrease: React.MouseEventHandler<HTMLButtonElement>;
  handlePurchaseAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  handleAddToCart: React.MouseEventHandler<HTMLButtonElement>;
}): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex === imageList.length - 1) {
        return setCurrentIndex(0);
      }
      setCurrentIndex(currentIndex + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, imageList]);

  function prevImage() {
    if (currentIndex === 0) {
      return setCurrentIndex(imageList.length - 1);
    }
    setCurrentIndex(currentIndex - 1);
  }

  function nextImage() {
    if (currentIndex === imageList.length - 1) {
      return setCurrentIndex(0);
    }
    setCurrentIndex(currentIndex + 1);
  }

  function goToSide(index: any) {
    setCurrentIndex(index);
  }

  return (
    <>
      <div className="mx-52 my-10">
        <div className="flex max-w-full w-full h-96 py-3 px-4 bg-orange-400 border border-b border-gray-200 rounded-md">
          <div className="w-1/3 relative group">
            <Image
              className="rounded-md w-full h-52 object-cover bg-center bg-cover"
              src={imageList[currentIndex] || "/blank-image.jpg"}
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
          <div className="flex-none w-2/3 ml-5">
            <p className="text-lg font-bold mb-3 uppercase">{productName}</p>
            <p className="text-md font-bold mb-3">
              PRODUCT QUANTITY: {productQuantity}
            </p>
            <p className="text-md font-bold mb-3">PRICE: {price}$</p>
            <div className="flex text-md font-bold mb-3 uppercase">
              CATEGORY:{" "}
              {categories.map(
                (category: any) => (
                  <CategoryTag key={category} category={category} />
                ),
                ""
              )}
            </div>
            <p className="text-md text-justify mb-5">{description}</p>
            <div className="h-10 w-32 mt-[70px] mb-3">
              <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                <button
                  className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                  onClick={handleDecrease}
                >
                  <span className="m-auto text-2xl font-thin">-</span>
                </button>
                <input
                  type="text"
                  className="focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black flex items-center text-gray-700 outline-none"
                  value={purchaseAmount}
                  onChange={handlePurchaseAmountChange}
                />
                <button
                  className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
                  onClick={handleIncrease}
                >
                  <span className="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <button
              className="flex px-4 py-2 bg-purple-500 border border-white hover:bg-purple-400 text-white font-bold rounded-md"
              type="button"
              onClick={handleAddToCart}
            >
              <BsCartPlus className="mr-2" size={20} /> ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
