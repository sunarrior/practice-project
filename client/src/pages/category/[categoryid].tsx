import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CategoryBanner from "@/components/category-banner";
import API from "@/config/axios.config";

const categoryInfoDefault: {
  url: string;
  name: string;
  productQuantity: number;
  description: string;
} = {
  url: "",
  name: "",
  productQuantity: 0,
  description: "",
};

export default function CategoryDetail() {
  const router = useRouter();
  const [categoryInfo, setCategoryInfo] = useState(categoryInfoDefault);
  const [sortOption, setSortOption] = useState("name");

  const { categoryid } = router.query;

  useEffect(() => {
    (async () => {
      // const token = localStorage.getItem("token");
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      const result = await API.get(`/category/${categoryid}`);
      setCategoryInfo(result.data.categoryInfo);
    })();
  }, [sortOption]);

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  return (
    <>
      <div className="my-10">
        <CategoryBanner
          url={categoryInfo.url || "/blank-image.jpg"}
          categoryName={categoryInfo.name}
          productQuantity={categoryInfo.productQuantity}
          description={categoryInfo.description}
        />
        <div className="mx-52 mt-5">
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
            <div className="flex flex-wrap"></div>
          </div>
        </div>
      </div>
    </>
  );
}
