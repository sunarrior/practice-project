/* eslint-disable no-lonely-if */
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { AdminContext } from "@/context/admin.context";
import Product from "@/components/product";
import ProductModalForm from "@/components/product-modal-form";
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
      <ul className="fixed w-48 h-fit text-sm font-medium text-gray-900 bg-gray-400 border border-gray-300 rounded-lg">
        {categoryListCheckbox}
      </ul>
    </>
  );
}

function ProductList({
  data,
  selectedProducts,
  handleProductSelectChange,
}: {
  data: any;
  selectedProducts: number[];
  handleProductSelectChange: (key: number) => void;
}): React.ReactElement {
  const productList = data.map((product: any) => {
    return (
      <Product
        key={product.id}
        id={product.id}
        url={product.url || "/blank-image.jpg"}
        productName={product.name}
        price={product.price}
        checked={selectedProducts.includes(product.id)}
        handleProductSelectChange={handleProductSelectChange}
      />
    );
  });
  return productList;
}

export default function Index(): React.ReactElement {
  const router = useRouter();
  const { isAdmin } = useContext(AdminContext);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [filterOption, setFilterOption] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("name");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
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
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
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

  function handleShowProductModal(state: boolean) {
    setShowProductModal(state);
  }

  function handleAddProduct() {
    router.reload();
  }

  function handleProductSelectChange(key: number) {
    if (!selectedProducts.includes(key)) {
      return setSelectedProducts([...selectedProducts, key]);
    }
    setSelectedProducts(
      selectedProducts.filter((item: number) => item !== key)
    );
  }

  async function handleDeleteProduct() {
    try {
      if (selectedProducts.length === 0) {
        return toast(
          "Please select atleast one product to delete by checkbox",
          {
            type: "warning",
            autoClose: 3000,
          }
        );
      }
      const userObj = JSON.parse(localStorage.getItem("_uob") as any);
      if (!userObj) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
        data: selectedProducts,
      };
      const result = await API.delete("/product", config);
      toast(result.data.msg, { type: "success", autoClose: 3000 });
      router.reload();
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
    }
  }

  return (
    <>
      {showProductModal && (
        <ProductModalForm
          handleShowModal={handleShowProductModal}
          onProductAction={handleAddProduct}
        />
      )}
      <div className="relative mx-10 my-10">
        <div className="flex mt-5">
          <div className="absolute w-60 h-full">
            <CategoryListCheckbox
              data={categoryList}
              onCheckboxClick={handleCheckboxChange}
            />
          </div>
          <div className="flex-none w-3/4 ml-60">
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
                  <option value="AscPrice">Ascending by price</option>
                  <option value="DescPrice">Descending by price</option>
                </select>
              </div>
              {isAdmin && (
                <div className="flex-none flex w-3/4 justify-end mr-4">
                  <button
                    className="bg-purple-500 hover:bg-purple-400 px-4 py-2 font-bold text-white rounded-md"
                    onClick={() => handleShowProductModal(true)}
                  >
                    Add
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-400 px-4 py-2 font-bold text-white rounded-md ml-2"
                    onClick={handleDeleteProduct}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="max-w-full my-2">
              <div className="flex flex-wrap">
                {productList ? (
                  <ProductList
                    data={productList}
                    selectedProducts={selectedProducts}
                    handleProductSelectChange={handleProductSelectChange}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
