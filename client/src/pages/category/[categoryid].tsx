import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import CategoryBanner from "@/components/category-banner";
import Product from "@/components/product";
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

function ProductList({ data }: { data: any }): React.ReactElement {
  const productList = data.map((product: any) => {
    return (
      <Product
        key={product.id}
        id={product.id}
        url={product.url || "/blank-image.jpg"}
        productName={product.name}
        price={product.price}
      />
    );
  });
  return productList;
}

export default function CategoryDetail(): React.ReactElement {
  const router = useRouter();
  const [categoryInfo, setCategoryInfo] = useState(categoryInfoDefault);
  const [productList, setProductList] = useState();
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
      if (!categoryid) {
        return;
      }
      const category = await API.get(`/category/${categoryid}`);
      const products = await API.get(`/product/${categoryid}/category`);
      const sortProducts = products.data.productList.sort(
        (p1: any, p2: any) => {
          if (sortOption === "DescName") {
            return p2.name.localeCompare(p1.name);
          }
          if (sortOption === "AscPrice") {
            return p1.price - p2.price;
          }
          if (sortOption === "DescPrice") {
            return p2.price - p1.price;
          }
          return p1.name.localeCompare(p2.name);
        }
      );
      setCategoryInfo(category.data.categoryInfo);
      setProductList(sortProducts);
    })();
  }, [sortOption, categoryid]);

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
              <option value="AscPrice">Ascending by price</option>
              <option value="DescPrice">Descending by price</option>
            </select>
          </div>
          <div className="container max-w-full my-2">
            <div className="flex flex-wrap">
              {productList ? <ProductList data={productList} /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
