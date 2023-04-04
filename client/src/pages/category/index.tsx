import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { AdminContext } from "@/context/admin.context";
import Category from "@/components/category";
import CategoryModalForm from "@/components/category-modal-form";
import API from "@/config/axios.config";

function CategoryList({
  data,
  checkedItems,
  handleCheckboxChange,
}: {
  data: any;
  checkedItems: number[];
  handleCheckboxChange: (key: number) => void;
}) {
  const categoryList = data.map((category: any) => {
    return (
      <Category
        key={category.id}
        url={category.url || "/blank-image.jpg"}
        categoryId={category.id}
        categoryName={category.name}
        productQuantity={category.productQuantity}
        checkedItem={checkedItems.includes(category.id)}
        handleCheckboxChange={handleCheckboxChange}
      />
    );
  });
  return categoryList;
}

export default function CategoryPage() {
  const router = useRouter();
  const { isAdmin } = useContext(AdminContext);
  const [categoryInfo, setCategoryInfo] = useState();
  const [sortOption, setSortOption] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      const result = await API.get("/category");
      const sortCategoryList = result.data.categoryList.sort(
        (c1: any, c2: any) => {
          if (sortOption === "DescName") {
            return c2.name.localeCompare(c1.name);
          }
          if (sortOption === "AscProductQuantity") {
            return c1.productQuantity - c2.productQuantity;
          }
          if (sortOption === "DescProductQuantity") {
            return c2.productQuantity - c1.productQuantity;
          }
          return c1.name.localeCompare(c2.name);
        }
      );
      setCategoryInfo(sortCategoryList);
    })();
  }, [sortOption]);

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  function handleShowModal(state: boolean) {
    setShowModal(state);
  }

  function handleAddCategory() {
    router.reload();
  }

  function handleCheckboxChange(key: number) {
    if (!checkedItems.includes(key)) {
      return setCheckedItems([...checkedItems, key]);
    }
    setCheckedItems(checkedItems.filter((item: number) => item !== key));
  }

  async function handleDeleteCategory() {
    try {
      if (checkedItems.length === 0) {
        return toast("Please select a category to delete by checkbox", {
          type: "warning",
          autoClose: 3000,
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
        data: checkedItems,
      };
      const result = await API.delete("/category", config);
      toast(result.data.msg, { type: "success", autoClose: 3000 });
      router.reload();
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
    }
  }

  return (
    <>
      {showModal && (
        <CategoryModalForm
          handleShowModal={handleShowModal}
          onCategoryAction={handleAddCategory}
        />
      )}
      <div className="mx-52 my-14 overflow-y-auto">
        <div className="flex">
          <div className="w-1/4">
            <select
              id="sort-option"
              className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleSortOptionChange}
            >
              <option value="AscName" defaultValue="AscName">
                Ascending by name
              </option>
              <option value="DescName">Descending by name</option>
              <option value="AscProductQuantity">
                Ascending by product quantity
              </option>
              <option value="DescProductQuantity">
                Descending by product quantity
              </option>
            </select>
          </div>
          {isAdmin && (
            <div className="flex w-3/4 justify-end">
              <button
                className="bg-purple-500 hover:bg-purple-400 px-4 py-2 font-bold text-white rounded-md"
                onClick={() => {
                  handleShowModal(true);
                }}
              >
                Add
              </button>
              <button
                className="bg-red-500 hover:bg-red-400 px-4 py-2 font-bold text-white rounded-md ml-2"
                onClick={handleDeleteCategory}
              >
                Detele
              </button>
            </div>
          )}
        </div>
        <div className="container max-w-full my-2 px-2">
          <div className="flex flex-wrap">
            {categoryInfo ? (
              <CategoryList
                data={categoryInfo}
                checkedItems={checkedItems}
                handleCheckboxChange={handleCheckboxChange}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
