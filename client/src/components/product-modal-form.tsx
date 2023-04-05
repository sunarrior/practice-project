import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TbCircleCheckFilled } from "react-icons/tb";

import SelectedCategoryTag from "@/components/selected-category-tag";
import API from "@/config/axios.config";

const productDataDefault = {
  productName: "",
  quantity: 0,
  price: 0,
  description: "",
};

const warningDefault = {
  isWarning: false,
  msg: "",
};

export default function ProductModal({
  productId,
  isEdit,
  currentData,
  handleShowModal,
  onProductAction,
}: {
  productId?: number;
  isEdit?: boolean;
  currentData?: {
    imagePreviews: string[];
    productName: string;
    quantity: number;
    price: number;
    description: string;
  };
  handleShowModal: (isShow: boolean) => void;
  onProductAction: () => void;
}): React.ReactElement {
  const [productData, setProductData] = useState(productDataDefault);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any[]>([]);
  const [imagesPreview, setImagesPreview] = useState<any[]>([]);
  const [imagesUpload, setImagesUpload] = useState<any[]>([]);
  const [isImageChange, setIsImageChange] = useState(false);
  const [uploadProgess, setUploadProgess] = useState(0);
  const [warning, setWarning] = useState(warningDefault);

  useEffect(() => {
    (async () => {
      if (currentData) {
        setProductData({
          productName: currentData.productName,
          quantity: currentData.quantity,
          price: currentData.price,
          description: currentData.description,
        });
      }
      const categories = await API.get("/category");
      const sortCategories = categories.data.categoryList.sort(
        (c1: any, c2: any) => c1.name.localeCompare(c2.name)
      );
      setCategoryList(sortCategories);
      // setImagePreview(currentData.imagePreview);
    })();
  }, [currentData]);

  function handleProductNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductData({ ...productData, productName: e.target.value });
  }

  function handleSelectedCategory(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectCategory = categoryList.find(
      (category: any) => category.name === e.target.value
    );
    const isExistCategory = selectedCategory.find(
      (category: any) => category.name === e.target.value
    );
    if (isExistCategory) {
      return;
    }
    setSelectedCategory([...selectedCategory, selectCategory]);
  }

  function handleDeleteCategoryTag(name: string) {
    const filterCategory = selectedCategory.filter(
      (category: any) => category.name !== name
    );
    setSelectedCategory(filterCategory);
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setProductData({ ...productData, description: e.target.value });
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductData({
      ...productData,
      quantity: e.target.value as unknown as number,
    });
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProductData({
      ...productData,
      price: e.target.value as unknown as number,
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // e.preventDefault();
    if (e.target.files === null) {
      return;
    }
    let images: any[] = [];
    for (let i = 0; i < e.target.files.length; i += 1) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      reader.onloadend = () => {
        images = [
          ...images,
          { id: i, url: reader.result as string, isDefault: false },
        ];
        images[0].isDefault = true;
        setImagesPreview(images);
        setImagesUpload(images);
        setIsImageChange(true);
      };
    }
    e.target.value = "";
  }

  function handleSelectDefaultThumbnail(pid: number) {
    const tmpImages = imagesUpload.map((image: any) => {
      if (image.id === pid) {
        return { ...image, isDefault: true };
      }
      return { ...image, isDefault: false };
    });
    // setDefaultThumbnail(pid);
    setImagesUpload(tmpImages);
  }

  function handleRemoveUploadImage(pid: number) {
    const newUploadImages = imagesUpload.filter(
      (image: any) => image.id !== pid
    );
    const isHaveDefault = newUploadImages.filter(
      (image: any) => image.isDefault
    );
    if (isHaveDefault.length === 0) {
      newUploadImages[0].isDefault = true;
    }
    setImagesUpload(newUploadImages);
  }

  async function handleProductAction() {
    setWarning({ ...warning, isWarning: false });
    if (
      productData.productName.localeCompare("") === 0 ||
      selectedCategory.length === 0 ||
      productData.description.localeCompare("") === 0
    ) {
      return setWarning({
        isWarning: true,
        msg: "Please provide all required information",
      });
    }
    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent: number = Math.floor((loaded * 100) / total);
        setUploadProgess(percent);
      },
    };
    if (!isEdit) {
      const data = {
        name: productData.productName,
        categories: selectedCategory,
        description: productData.description,
        quantity: productData.quantity,
        price: productData.price,
        filesPath: imagesUpload,
      };
      await API.post("/product", data, config);
    } else {
      const data = {
        id: productId,
        name: productData.productName,
        description: productData.description,
        filePath: isImageChange ? productData : "",
      };
      // await API.put("/category", data, config);
    }
    setIsImageChange(false);
    setImagesUpload([]);
    onProductAction();
  }

  return (
    <>
      <div className="z-50 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto overscroll-none no-scrollbar">
        <div className="max-w-3xl my-6 mx-auto relative w-full">
          {/* content */}
          <div className="max-h-full overflow-hidden border-none rounded-lg shadow-lg relative flex flex-col w-full bg-white bg-clip-padding outline-none text-current px-2">
            {/* header */}
            <div className="items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Product Form</h3>
            </div>
            {/* body */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-72 place-content-center">
                <Image
                  className="object-cover h-56 w-96 rounded-2xl bg-white"
                  src={
                    imagesUpload.find((image: any) => image.isDefault)?.url ||
                    "/blank-image.jpg"
                  }
                  alt="image"
                  width={500}
                  height={500}
                />
                <div className="grid place-content-center mt-2">
                  <div className="relative flex justify-center h-11 rounded-md cursor-pointer bg-purple-500 hover:bg-purple-400">
                    <input
                      className="z-20 opacity-0 w-full cursor-pointer"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                    <span className="absolute grid place-content-center h-full w-full">
                      <p className="font-bold text-white">Upload Image</p>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={productData.productName}
                    placeholder="Product Name"
                    onChange={handleProductNameChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <select
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    onChange={handleSelectedCategory}
                    required
                  >
                    <option value="">-- Category --</option>
                    {categoryList.map((category: any) => {
                      return (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-4 flex">
                  {selectedCategory.map((category: any) => {
                    return (
                      <SelectedCategoryTag
                        key={category.id}
                        category={category.name}
                        handleRemoveTag={handleDeleteCategoryTag}
                      />
                    );
                  })}
                </div>
                <div className="mb-2">
                  <textarea
                    rows={4}
                    className="w-full border-2 px-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={productData.description}
                    placeholder="Description"
                    onChange={handleDescriptionChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={productData.quantity}
                    placeholder="Product Quantity"
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={productData.price}
                    placeholder="Product Price"
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
            </div>
            {/* footer */}
            <div className="mt-4 mb-3 border border-dashed border-gray-600 bg-gray-200">
              <h1 className="ml-2 pb-3 font-semibold text-lg text-gray-900">
                Upload Images (Select one below to be default thumbnail)
              </h1>

              <ul id="gallery" className="flex items-center -m-1 mb-4 ml-2">
                {imagesUpload.length === 0 && (
                  <>
                    <li className="h-full w-fit ml-1 text-center inline-block">
                      <Image
                        className="mx-auto h-24 w-24 object-cover rounded-md"
                        src="/blank-image.jpg"
                        alt="no data"
                        width={500}
                        height={500}
                      />
                    </li>
                    <span className="ml-2 text-small text-gray-500">
                      No files selected
                    </span>
                  </>
                )}
                {imagesUpload.map((image: any) => {
                  return (
                    <li
                      key={image.id}
                      className="relative group h-full w-fit ml-1 text-center inline-block"
                    >
                      {image.isDefault && (
                        <TbCircleCheckFilled
                          size={25}
                          className="absolute top-1 left-1 text-green-400"
                        />
                      )}
                      <div className="absolute w-full h-full hidden group-hover:block">
                        <div className="w-full h-full bg-gray-500 opacity-50"></div>
                        <button
                          className="z-50 absolute top-1 right-2 font-bold text-xl text-white"
                          onClick={() => handleRemoveUploadImage(image.id)}
                        >
                          X
                        </button>
                      </div>
                      <div
                        className="absolute w-full h-full"
                        onClick={() => handleSelectDefaultThumbnail(image.id)}
                      ></div>
                      <Image
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                        src={image.url}
                        alt="no data"
                        width={500}
                        height={500}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${uploadProgess}%` }}
              hidden={uploadProgess === 0}
            >
              {" "}
              {uploadProgess}%
            </div>
            {warning.isWarning && (
              <div
                className="bg-orange-100 border border-orange-500 text-orange-700 p-3"
                role="alert"
              >
                <p>{warning.msg}</p>
              </div>
            )}
            <div className="border-t border-solid border-slate-200 rounded-b">
              <div className="flex items-center justify-end p-4">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleShowModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 hover:bg-green-400 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleProductAction}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
