import React, { useState, useEffect, useContext } from "react";
import { NextRouter, useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "@/context/admin.context";
import { CategoryData } from "@/interface/CategoryData";
import { ProductData } from "@/interface/ProductData";
import ProductCard from "@/components/product-card";
import AdminProductModal from "@/components/admin-product-modal";
import CategoryCheckbox from "@/components/category-checkbox";
import API from "@/config/axios.config";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";

function CategoryListCheckbox({
  data,
  onCheckboxClick,
}: {
  data: CategoryData[];
  onCheckboxClick: React.ChangeEventHandler<HTMLInputElement>;
}): React.ReactElement {
  const categoryListCheckbox: React.ReactElement[] = data.map(
    (category: CategoryData) => {
      return (
        <CategoryCheckbox
          key={category.id}
          id={category.id as number}
          categoryName={category.name}
          onCheckboxClick={onCheckboxClick}
        />
      );
    }
  );
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
  onProductSelectChange,
}: {
  data: ProductData[];
  selectedProducts: number[];
  onProductSelectChange: (key: number) => void;
}): React.ReactElement {
  const productList: React.ReactElement[] = data.map((product: ProductData) => {
    return (
      <ProductCard
        key={product.id}
        id={product.id}
        url={product.url || "/blank-image.jpg"}
        productName={product.name}
        price={product.price}
        checked={selectedProducts.includes(product.id)}
        onProductSelectChange={onProductSelectChange}
      />
    );
  });
  return <>{productList}</>;
}

export default function Index(): React.ReactElement {
  const router: NextRouter = useRouter();
  const { isAdmin } = useContext(AdminContext);
  const [categoryList, setCategoryList] = useState<CategoryData[]>([]);
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [filterOption, setFilterOption] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("name");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        const categories: AxiosResponse = await API.get("/categories");
        const products: AxiosResponse = await API.get("/products");
        const sortCategories: CategoryData[] =
          categories.data.categoryList.sort(
            (c1: CategoryData, c2: CategoryData) =>
              c1.name.localeCompare(c2.name)
          );
        let productFilter: ProductData[] = products.data.productList.map(
          (product: ProductData) => {
            if (filterOption.length <= 0) {
              return product;
            }

            filterOption.forEach((option: string) => {
              if (product.categories?.includes(option)) {
                return product;
              }
            });
            return undefined;
          }
        );
        productFilter = productFilter.filter(
          (product: ProductData) => product !== undefined
        );
        const sortProducts: ProductData[] = productFilter.sort(
          (p1: ProductData, p2: ProductData) => {
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
        setCategoryList(sortCategories);
        setProductList(sortProducts);
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
    })();
  }, [filterOption, isAdmin, sortOption]);

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (filterOption.includes(e.target.value)) {
      if (!e.target.checked) {
        return setFilterOption(
          filterOption?.filter((option: string) => option !== e.target.value)
        );
      }
      return;
    }
    if (e.target.checked) {
      setFilterOption([...(filterOption as string[]), e.target.value]);
    }
  }

  function handleSortOptionChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setSortOption(e.target.value);
  }

  function handleShowProductModal(state: boolean): void {
    setShowProductModal(state);
  }

  function handleAddProduct(): void {
    router.reload();
  }

  function handleProductSelectChange(key: number): void {
    if (!selectedProducts.includes(key)) {
      return setSelectedProducts([...selectedProducts, key]);
    }
    setSelectedProducts(
      selectedProducts.filter((item: number) => item !== key)
    );
  }

  async function handleDeleteProduct(): Promise<any> {
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
        data: selectedProducts,
      };
      const result: AxiosResponse = await API.delete("/products", config);
      toast(result.data.msg, { type: "success", autoClose: 3000 });
      router.reload();
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
    }
  }

  return (
    <>
      {showProductModal && (
        <AdminProductModal
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
                    onProductSelectChange={handleProductSelectChange}
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
