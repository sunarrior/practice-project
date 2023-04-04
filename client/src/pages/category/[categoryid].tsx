import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { AdminContext } from "@/context/admin.context";
import CategoryBanner from "@/components/category-banner";
import Product from "@/components/product";
import CategoryModalForm from "@/components/category-modal-form";
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
  const { isAdmin } = useContext(AdminContext);
  const [categoryInfo, setCategoryInfo] = useState(categoryInfoDefault);
  const [productList, setProductList] = useState();
  const [sortOption, setSortOption] = useState("name");
  const [showModal, setShowModal] = useState(false);

  const { categoryid } = router.query;

  useEffect(() => {
    (async () => {
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

  function handleShowModal(state: boolean) {
    setShowModal(state);
  }

  function handleCategoryEdit() {
    router.reload();
  }

  return (
    <>
      {showModal && (
        <CategoryModalForm
          categoryId={categoryid as unknown as number}
          isEdit={true}
          currentData={{
            imagePreview: categoryInfo.url || "/blank-image.jpg",
            categoryName: categoryInfo.name,
            description: categoryInfo.description,
          }}
          handleShowModal={handleShowModal}
          onCategoryAction={handleCategoryEdit}
        />
      )}
      <div className="my-10">
        <CategoryBanner
          url={categoryInfo.url || "/blank-image.jpg"}
          categoryName={categoryInfo.name}
          productQuantity={categoryInfo.productQuantity}
          description={categoryInfo.description}
          handleShowModal={handleShowModal}
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
              <div className="flex w-3/4 justify-end mr-4">
                <button className="bg-purple-500 hover:bg-purple-400 px-4 py-2 font-bold text-white rounded-md">
                  Add
                </button>
                <button className="bg-red-500 hover:bg-red-400 px-4 py-2 font-bold text-white rounded-md ml-2">
                  Delete
                </button>
              </div>
            )}
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
