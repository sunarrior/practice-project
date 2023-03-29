/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from "react";

import Product from "@/components/product";
import CategoryCheckbox from "@/components/category-checkbox";
import API from "@/config/axios.config";

function CategoryListCheckbox({
  data,
  onCheckboxClick,
}: {
  data: any;
  onCheckboxClick: any;
}): React.ReactElement {
  const categoryListCheckbox = data.map((category: any) => {
    return (
      <CategoryCheckbox
        key={category.id}
        id={category.id}
        categoryName={category.name}
        onCheckboxClick={onCheckboxClick}
      />
    );
  });
  return (
    <>
      <ul className="w-48 h-fit text-sm font-medium text-gray-900 bg-gray-400 border border-gray-300 rounded-lg">
        {categoryListCheckbox}
      </ul>
    </>
  );
}

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

export default function Index(): React.ReactElement {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [filterOption, setFilterOption] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("name");

  // const { categoryid } = router.query;

  useEffect(() => {
    (async () => {
      // const token = localStorage.getItem("token");
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // if (!categoryid) {
      //   return;
      // }
      const categories = await API.get("/category");
      const products = await API.get("/product");
      const sortCategories = categories.data.categoryList.sort(
        (c1: any, c2: any) => c1.name.localeCompare(c2.name)
      );
      let filterProduct = products.data.productList.map((product: any) => {
        if (filterOption.length <= 0) {
          return product;
        }

        for (const option of filterOption) {
          if (product.categories.includes(option)) {
            return product;
          }
        }
        return undefined;
      });
      filterProduct = filterProduct.filter(
        (product: any) => product !== undefined
      );
      const sortProducts = filterProduct.sort((p1: any, p2: any) => {
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
      });
      setCategoryList(sortCategories);
      setProductList(sortProducts);
    })();
  }, [filterOption, sortOption]);

  function handleCheckboxChange(e: any) {
    if (filterOption.includes(e.target.value)) {
      if (!e.target.checked) {
        setFilterOption(
          filterOption?.filter((option: string) => option !== e.target.value)
        );
      }
    } else {
      if (e.target.checked) {
        setFilterOption([...(filterOption as string[]), e.target.value]);
      }
    }
  }

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  return (
    <>
      <div className="mx-10 my-10">
        <div className="flex mt-5">
          <CategoryListCheckbox
            data={categoryList}
            onCheckboxClick={handleCheckboxChange}
          />
          <div className="flex-none w-3/4 ml-6">
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
            <div className="max-w-full my-2">
              <div className="flex flex-wrap">
                {productList ? <ProductList data={productList} /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
