import { useState, useEffect, useContext } from "react";
import { useRouter, NextRouter } from "next/router";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "@/context/admin.context";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import { CategoryData } from "@/interface/CategoryData";
import { ProductData } from "@/interface/ProductData";
import { productConstant } from "@/constant/product.constant";
import CategoryBanner from "@/components/category-banner";
import ProductCard from "@/components/product-card";
import AdminCategoryModal from "@/components/admin-category-modal";
import AdminProductModal from "@/components/admin-product-modal";
import API from "@/config/axios.config";

const categoryInfoDefault: CategoryData = {
  url: "",
  name: "",
  productQuantity: 0,
  description: "",
};

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

export default function CategoryDetail(): React.ReactElement {
  const router: NextRouter = useRouter();
  const { isAdmin } = useContext(AdminContext);
  const [categoryInfo, setCategoryInfo] =
    useState<CategoryData>(categoryInfoDefault);
  const [productList, setProductList] = useState<ProductData[]>([]);
  const [sortOption, setSortOption] = useState("name");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const { categoryid } = router.query;

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        if (!categoryid) {
          return;
        }
        const category: AxiosResponse = await API.get(
          `/categories/${categoryid}`
        );
        const products: AxiosResponse = await API.get(
          `/categories/${categoryid}/products`
        );
        const sortProducts: ProductData[] = products.data.productList.sort(
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
        setCategoryInfo(category.data.categoryInfo);
        setProductList(sortProducts);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, [sortOption, categoryid]);

  function handleSortOptionChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
    setSortOption(e.target.value);
  }

  function handleShowCategoryModal(state: boolean): void {
    setShowCategoryModal(state);
  }

  function handleEditCategory(): void {
    router.reload();
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
        return toast(productConstant.SELECT_FOR_DELETE, {
          type: "warning",
          autoClose: 3000,
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
        data: selectedProducts,
      };
      const result: AxiosResponse = await API.delete("/products", config);
      toast(result.data.msg, { type: "success", autoClose: 3000 });
      router.reload();
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <>
      {showCategoryModal && (
        <AdminCategoryModal
          categoryId={categoryid as unknown as number}
          isEdit={true}
          currentData={{
            imagePreview: categoryInfo.url || "/blank-image.jpg",
            categoryName: categoryInfo.name,
            description: categoryInfo.description as string,
          }}
          handleShowModal={handleShowCategoryModal}
          onCategoryAction={handleEditCategory}
        />
      )}
      {showProductModal && (
        <AdminProductModal
          handleShowModal={handleShowProductModal}
          onProductAction={handleAddProduct}
        />
      )}
      <div className="my-10">
        <CategoryBanner
          url={categoryInfo.url || "/blank-image.jpg"}
          categoryName={categoryInfo.name}
          productQuantity={categoryInfo.productQuantity as number}
          description={categoryInfo.description as string}
          handleShowModal={handleShowCategoryModal}
        />
        <div className="mx-52 mt-5">
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
          <div className="container max-w-full my-2">
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
    </>
  );
}
