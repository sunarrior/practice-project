import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TbCircleCheckFilled } from "react-icons/tb";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { NotifyData } from "@/interface/NotifyData";
import { CategoryData } from "@/interface/CategoryData";
import {
  AddProductData,
  ProductDataModal,
  ProductCategoryData,
  ProductImageData,
} from "@/interface/ProductData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import { productConstant } from "@/constant/product.constant";
import SelectedCategoryTag from "@/components/selected-category-tag";
import API from "@/config/axios.config";

const productDataDefault: AddProductData = {
  productName: "",
  quantity: 0,
  price: 0,
  description: "",
};

const notifyDefault: NotifyData = {
  isFailed: false,
  msg: "",
};

export default function ProductModal({
  isEdit,
  currentData,
  handleShowModal,
  onProductAction,
}: {
  isEdit?: boolean;
  currentData?: {
    productId: number;
    imagesPreview: (ProductImageData | undefined)[];
    productName: string;
    categories: (ProductCategoryData | undefined)[];
    quantity: number;
    price: number;
    description: string;
  };
  handleShowModal: (isShow: boolean) => void;
  onProductAction: () => void;
}): React.ReactElement {
  const [productData, setProductData] = useState(productDataDefault);
  const [categoryList, setCategoryList] = useState<CategoryData[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    (ProductCategoryData | undefined)[]
  >([]);
  const [newCategories, setNewCategories] = useState<CategoryData[]>([]);
  const [removeCategories, setRemoveCategories] = useState<
    ProductCategoryData[]
  >([]);
  const [defaultThumbnail, setDefaultThumbnail] = useState(0);
  const [imagesPreview, setImagesPreview] = useState<
    (ProductImageData | undefined)[]
  >([]);
  const [imagesUpload, setImagesUpload] = useState<ProductImageData[]>([]);
  const [imagesUpdate, setImagesUpdate] = useState<ProductImageData[]>([]);
  const [imagesRemove, setImagesRemove] = useState<ProductImageData[]>([]);
  const [uploadProgess, setUploadProgess] = useState(0);
  const [notify, setNotify] = useState(notifyDefault);

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        if (currentData) {
          setImagesPreview([...currentData.imagesPreview]);
          setSelectedCategories([...currentData.categories]);
          setProductData({
            productName: currentData.productName,
            quantity: currentData.quantity,
            price: currentData.price,
            description: currentData.description,
          });
          const defaultThumb: ProductImageData | undefined =
            currentData.imagesPreview?.find(
              (image: ProductImageData | undefined) => image?.isDefault
            );
          setDefaultThumbnail(defaultThumb?.id as number);
        }
        const categories: AxiosResponse = await API.get("/categories");
        const sortCategories: CategoryData[] =
          categories.data.categoryList.sort(
            (c1: CategoryData, c2: CategoryData) =>
              c1.name.localeCompare(c2.name)
          );
        setCategoryList([...sortCategories]);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, [currentData]);

  function handleProductNameChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setProductData({ ...productData, productName: e.target.value });
  }

  function handleSelectedCategory(
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    const isRemoveCategory: ProductCategoryData | undefined =
      removeCategories.find(
        (category: any) => category.name === e.target.value
      );
    if (isRemoveCategory) {
      const tmpRemoveCategory: ProductCategoryData[] = removeCategories.filter(
        (category: ProductCategoryData) => category.name !== e.target.value
      );
      setRemoveCategories(tmpRemoveCategory);
      return setSelectedCategories([...selectedCategories, isRemoveCategory]);
    }
    const isExistOldCategory: ProductCategoryData | undefined =
      selectedCategories.find(
        (category: ProductCategoryData | undefined) =>
          category?.name === e.target.value
      );
    const isExistNewCategory: CategoryData | undefined = newCategories.find(
      (category: CategoryData | undefined) => category?.name === e.target.value
    );
    if (isExistOldCategory || isExistNewCategory) {
      e.target.options[0].selected = true;
      return;
    }
    const newCategory: CategoryData | undefined = categoryList.find(
      (category: CategoryData | undefined) => category?.name === e.target.value
    );
    setNewCategories([...newCategories, newCategory as CategoryData]);
    e.target.options[0].selected = true;
  }

  function handleDeleteCategoryTag(name: string): void {
    const removeCategory: ProductCategoryData | undefined =
      selectedCategories.find(
        (category: ProductCategoryData | undefined) => category?.name === name
      );
    if (removeCategory) {
      const filterCategory: (ProductCategoryData | undefined)[] =
        selectedCategories.filter(
          (category: ProductCategoryData | undefined) => category?.name !== name
        );
      setRemoveCategories([...removeCategories, removeCategory]);
      return setSelectedCategories(filterCategory);
    }
    const filterCategory: CategoryData[] = newCategories.filter(
      (category: CategoryData) => category.name !== name
    );
    setNewCategories(filterCategory);
  }

  function handleDescriptionChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    setProductData({ ...productData, description: e.target.value });
  }

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProductData({
      ...productData,
      quantity: e.target.value as unknown as number,
    });
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setProductData({
      ...productData,
      price: e.target.value as unknown as number,
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const largestId: number =
      imagesPreview.length > 0
        ? Math.max(
            ...imagesPreview.map(
              (image: ProductImageData | undefined) => image?.id as number
            )
          )
        : 0;
    if (e.target.files === null) {
      return;
    }
    let images: ProductImageData[] = [];
    for (let i = 0; i < e.target.files.length; i += 1) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      reader.onloadend = () => {
        const isExistImage: ProductImageData | undefined = imagesUpload.find(
          (image: ProductImageData) => image.url === (reader.result as string)
        );
        if (isExistImage) {
          return;
        }
        images = [
          ...images,
          {
            id: largestId + 1 + i || i,
            url: reader.result as string,
            isDefault: false,
          },
        ];
        const isHaveDefault: ProductImageData | undefined = imagesPreview.find(
          (image: ProductImageData | undefined) => image?.isDefault
        );
        if (!isHaveDefault) {
          images[0].isDefault = true;
          setDefaultThumbnail(images[0].id);
        }
        setImagesUpload(images);
      };
    }
    e.target.value = "";
  }

  function handleSelectDefaultThumbnail(pid: number): void {
    let tmpImagesUpdate: ProductImageData[] = [];
    const tmpImagesPreview: (ProductImageData | undefined)[] | undefined =
      currentData?.imagesPreview.map((image: ProductImageData | undefined) => {
        const inImagePreview: ProductImageData | undefined = imagesPreview.find(
          (img: ProductImageData | undefined) => img?.id === image?.id
        );
        if (!inImagePreview) {
          return;
        }
        if (image?.id === pid) {
          if (!image?.isDefault) {
            tmpImagesUpdate = [
              ...tmpImagesUpdate,
              { ...image, isDefault: true },
            ];
          }
          return { ...image, isDefault: true } as ProductImageData;
        }
        if (image?.isDefault) {
          tmpImagesUpdate = [
            ...tmpImagesUpdate,
            { ...image, isDefault: false },
          ];
        }
        return { ...image, isDefault: false } as ProductImageData;
      });
    const tmpImagesPreviewFilter: (ProductImageData | undefined)[] | undefined =
      tmpImagesPreview?.filter((image: ProductImageData | undefined) => image);

    const tmpImagesUpload: ProductImageData[] = imagesUpload.map(
      (image: ProductImageData) => {
        if (image.id === pid) {
          return { ...image, isDefault: true };
        }
        return { ...image, isDefault: false };
      }
    );
    setDefaultThumbnail(pid);
    setImagesUpdate(tmpImagesUpdate);
    setImagesPreview(
      tmpImagesPreviewFilter as (ProductImageData | undefined)[]
    );
    setImagesUpload(tmpImagesUpload);
  }

  function handleRemoveUploadImage(pid: number): void {
    const isOldImage: ProductImageData | undefined = imagesPreview.find(
      (image: ProductImageData | undefined) => image?.id === pid
    );
    if (isOldImage) {
      const newImagesPreview: (ProductImageData | undefined)[] = imagesPreview
        .filter((image: ProductImageData | undefined) => image?.id !== pid)
        .map((image: ProductImageData | undefined) => {
          return { ...image } as ProductImageData;
        });

      // check if update image contain image has been removed
      const inImagesUpdate: ProductImageData | undefined = imagesUpdate.find(
        (image: ProductImageData) => image.id === isOldImage.id
      );
      if (inImagesUpdate) {
        const tmpImagesUpdate: ProductImageData[] = imagesUpdate.filter(
          (image: ProductImageData) => image.id !== isOldImage.id
        );
        setImagesUpdate(tmpImagesUpdate);
      }

      const isHaveDefaultPreview: ProductImageData | undefined =
        newImagesPreview.find((image: ProductImageData | undefined) => {
          return image?.isDefault;
        });
      const isHaveDefaultUpload: ProductImageData | undefined =
        imagesUpload.find((image: ProductImageData) => image.isDefault);
      if (!isHaveDefaultPreview && !isHaveDefaultUpload) {
        if (newImagesPreview.length > 0) {
          (newImagesPreview[0] as ProductImageData).isDefault = true;
          setImagesUpdate([
            { ...newImagesPreview[0], isDefault: true } as ProductImageData,
          ]);
          setDefaultThumbnail(newImagesPreview[0]?.id as number);
        } else if (imagesUpload.length > 0) {
          const newImagesUpload = [...imagesUpload];
          newImagesUpload[0] = { ...newImagesUpload[0], isDefault: true };
          setImagesUpload(newImagesUpload);
          setDefaultThumbnail(imagesUpload[0]?.id as number);
        } else {
          setDefaultThumbnail(0);
        }
      }
      setImagesRemove([...imagesRemove, isOldImage]);
      return setImagesPreview(newImagesPreview);
    }
    const newImagesUpload: ProductImageData[] = imagesUpload.filter(
      (image: ProductImageData) => image.id !== pid
    );
    const isHaveDefaultUpload: ProductImageData | undefined =
      newImagesUpload.find((image: ProductImageData) => image.isDefault);
    const isHaveDefaultPreview: ProductImageData | undefined =
      imagesPreview.find(
        (image: ProductImageData | undefined) => image?.isDefault
      );
    if (!isHaveDefaultUpload && !isHaveDefaultPreview) {
      if (imagesPreview.length > 0) {
        if (imagesUpdate.length > 0) {
          setImagesUpdate([]);
          setDefaultThumbnail(imagesUpdate[0].id);
        } else {
          setImagesUpdate([
            { ...imagesPreview[0], isDefault: true } as ProductImageData,
          ]);
          setDefaultThumbnail(imagesPreview[0]?.id as number);
        }
      } else if (newImagesUpload.length > 0) {
        const tmpNewImagesUpload = [...newImagesUpload];
        tmpNewImagesUpload[0] = { ...tmpNewImagesUpload[0], isDefault: true };
        setImagesUpload(tmpNewImagesUpload);
        setDefaultThumbnail(tmpNewImagesUpload[0]?.id as number);
      } else {
        setDefaultThumbnail(0);
      }
    }
    return setImagesUpload(newImagesUpload);
  }

  async function handleProductAction(): Promise<void> {
    try {
      setNotify({ ...notify, isFailed: false });
      if (
        productData.productName.localeCompare("") === 0 ||
        (selectedCategories.length === 0 && newCategories.length === 0) ||
        productData.description.localeCompare("") === 0
      ) {
        return setNotify({
          isFailed: true,
          msg: productConstant.PROVIDE_ALL_INFORMATION,
        });
      }
      const userObj: UserObjectLS = JSON.parse(
        localStorage.getItem("_uob") as any
      );
      if (!userObj) {
        return;
      }
      const config: ApiConfig = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
        onUploadProgress: (progressEvent: any): void => {
          const { loaded, total } = progressEvent;
          const percent: number = Math.floor((loaded * 100) / total);
          setUploadProgess(percent);
        },
      };
      if (!isEdit) {
        const data: ProductDataModal = {
          name: productData.productName,
          newCategories,
          description: productData.description,
          quantity: productData.quantity,
          price: productData.price,
          filesPath: imagesUpload,
        };
        // console.log(data);
        await API.post("/products", data, config);
      } else {
        const data: ProductDataModal = {
          name: productData.productName,
          removeCategories,
          newCategories,
          description: productData.description,
          quantity: productData.quantity,
          price: productData.price,
          filesPath: imagesUpload.length > 0 ? imagesUpload : [],
          imagesUpdate,
          imagesRemove: imagesRemove.length > 0 ? imagesRemove : [],
        };
        // console.log(data);
        await API.put(`/products/${currentData?.productId}`, data, config);
      }
      setImagesUpload([]);
      onProductAction();
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
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
                    imagesUpload.find(
                      (image: any) => image.id === defaultThumbnail
                    )?.url ||
                    imagesPreview.find(
                      (image: any) => image.id === defaultThumbnail
                    )?.url ||
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
                  <p className="font-bold">- Product Name -</p>
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
                    <option>-- Category --</option>
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
                  {selectedCategories.map((category: any) => {
                    return (
                      <SelectedCategoryTag
                        key={category.id}
                        category={category.name}
                        handleRemoveTag={handleDeleteCategoryTag}
                      />
                    );
                  })}
                  {newCategories.map((category: any) => {
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
                  <p className="font-bold">- Description -</p>
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
                  <p className="font-bold">- Product Quantity -</p>
                  <input
                    type="text"
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={productData.quantity}
                    placeholder="Product Quantity"
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="mb-4">
                  <p className="font-bold">- Price -</p>
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
                {imagesUpload.length === 0 && imagesPreview.length === 0 && (
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
                {imagesPreview.map((image: any) => {
                  return (
                    <li
                      key={image.id}
                      className="relative group h-full w-fit ml-1 text-center inline-block"
                    >
                      {image.id === defaultThumbnail && (
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
                {imagesUpload.map((image: any) => {
                  return (
                    <li
                      key={image.id}
                      className="relative group h-full w-fit ml-1 text-center inline-block"
                    >
                      {image.id === defaultThumbnail && (
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
            {notify.isFailed && (
              <div
                className="bg-orange-100 border border-orange-500 text-orange-700 p-3"
                role="alert"
              >
                <p>{notify.msg}</p>
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
