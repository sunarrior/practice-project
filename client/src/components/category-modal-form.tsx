import React, { useState, useEffect } from "react";
import Image from "next/image";

import API from "@/config/axios.config";

const categoryDataDefault = {
  categoryName: "",
  description: "",
};

const warningDefault = {
  isWarning: false,
  msg: "",
};

export default function CheckoutModal({
  isEdit,
  currentData,
  handleShowModal,
  onCategoryAction,
}: {
  isEdit?: boolean;
  currentData?: {
    imagePreview: string;
    categoryName: string;
    description: string;
  };
  handleShowModal: (isShow: boolean) => void;
  onCategoryAction: () => void;
}): React.ReactElement {
  const [categoryData, setCategoryData] = useState(categoryDataDefault);
  const [warning, setWarning] = useState(warningDefault);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgess, setUploadProgess] = useState(0);

  useEffect(() => {
    if (!currentData) {
      return;
    }
    setCategoryData({
      categoryName: currentData.categoryName,
      description: currentData.description,
    });
    setImagePreview(currentData.imagePreview);
  }, [currentData]);

  function handleCategoryNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCategoryData({ ...categoryData, categoryName: e.target.value });
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategoryData({ ...categoryData, description: e.target.value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // e.preventDefault();
    if (e.target.files === null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    e.target.value = "";
  }

  async function handleCategoryAction() {
    setWarning({ ...warning, isWarning: false });
    if (
      categoryData.categoryName.localeCompare("") === 0 ||
      categoryData.description.localeCompare("") === 0
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
    const data = {
      name: categoryData.categoryName,
      description: categoryData.description,
      filePath: imagePreview,
    };
    if (!isEdit) {
      await API.post("/category", data, config);
    } else {
      // await API.put("/category", data, config);
      console.log("work");
    }
    onCategoryAction();
  }

  return (
    <>
      <div className="z-50 fixed top-20 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-hidden">
        <div className="h-full max-w-3xl my-6 mx-auto relative w-full">
          {/* content */}
          <div className="max-h-full overflow-hidden border-none rounded-lg shadow-lg relative flex flex-col w-full bg-white bg-clip-padding outline-none text-current px-2">
            {/* header */}
            <div className="items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Add New Category</h3>
            </div>
            {/* body */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-72 place-content-center">
                <Image
                  className="object-cover h-56 w-96 rounded-2xl bg-white"
                  src={imagePreview || "/blank-image.jpg"}
                  alt="image"
                  width={500}
                  height={500}
                />
                <div className="grid place-content-center mt-2">
                  <div className="relative flex justify-center h-11 rounded-md cursor-pointer bg-purple-500 hover:bg-purple-400">
                    <input
                      className="z-20 opacity-0 w-full cursor-pointer"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <span className="absolute grid place-content-center h-full w-full">
                      <p className="font-bold text-white">Upload Image</p>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <input
                    type="text"
                    className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={categoryData.categoryName}
                    placeholder="Category name"
                    onChange={handleCategoryNameChange}
                    required
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    rows={6}
                    className="w-full border-2 px-2 outline-none bg-slate-200 focus:bg-slate-50 rounded-md"
                    value={categoryData.description}
                    placeholder="Description"
                    onChange={handleDescriptionChange}
                    required
                  />
                </div>
              </div>
            </div>
            {/* footer */}
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
                  onClick={handleCategoryAction}
                >
                  Add
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