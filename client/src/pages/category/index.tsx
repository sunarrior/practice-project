import { useState, useEffect } from "react";
import Link from "next/link";

import Category from "@/components/category";
import API from "@/config/axios.config";

function CategoryList({ data }: { data: any }) {
  const categoryList = data.map((category: any) => {
    return (
      <Link key={category.id} href={`/category/${category.id}`}>
        <Category
          url={category.url || "/blank-image.jpg"}
          categoryName={category.name}
          productQuantity={category.productQuantity}
        />
      </Link>
    );
  });
  return categoryList;
}

export default function CategoryPage() {
  const [categoryInfo, setCategoryInfo] = useState();
  const [sortOption, setSortOption] = useState("name");

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const result = await API.get("/category", config);
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

  return (
    <>
      <div className="mx-52 my-14">
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
        <div className="container max-w-full my-2 px-4">
          <div className="flex flex-wrap">
            {categoryInfo ? <CategoryList data={categoryInfo} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
