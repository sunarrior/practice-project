/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { CartContext } from "@/context/cart.context";
import ProductDetail from "@/components/product-detail";
import API from "@/config/axios.config";

const productDetailDefault: {
  productId: number;
  productName: string;
  productQuantity: number;
  price: number;
  description: string;
  imageList: any[];
  categories: [];
} = {
  productId: 0,
  productName: "",
  productQuantity: 0,
  price: 0,
  description: "",
  imageList: [],
  categories: [],
};

export default function ProductPage(): React.ReactElement {
  const router = useRouter();
  const { cartState, setCartState } = useContext(CartContext);
  const [productDetail, setProductDetail] = useState(productDetailDefault);
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  const { productid } = router.query;

  useEffect(() => {
    (async () => {
      if (!productid) {
        return;
      }
      const result = await API.get(`/product/${productid}`);
      const sortImageList = result.data.productDetail.imageList.sort(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (i1: any, i2: any) => {
          if (i1.isDefault) {
            return -1;
          }
          return 1;
        }
      );
      setProductDetail({
        productId: productid as unknown as number,
        productName: result.data.productDetail.name || "",
        productQuantity: result.data.productDetail.quantity || "",
        price: result.data.productDetail.price || "",
        description: result.data.productDetail.description || "",
        imageList:
          sortImageList.length > 0
            ? sortImageList
            : [{ id: 0, url: "/blank-image.jpg", isDefault: true }],
        categories: result.data.productDetail.categories || [],
      });
    })();
  }, [productid]);

  function handleIncrease() {
    if (Number(purchaseAmount + 1) <= productDetail.productQuantity) {
      setPurchaseAmount(purchaseAmount + 1);
    }
  }

  function handleDecrease() {
    if (Number(purchaseAmount - 1) > 0) {
      setPurchaseAmount(purchaseAmount - 1);
    }
  }

  function handlePurchaseAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (
      Number(e.target.value) > 0 &&
      Number(e.target.value) <= productDetail.productQuantity
    ) {
      setPurchaseAmount(e.target.value as unknown as number);
    }
  }

  async function handleAddToCart() {
    const userObj = JSON.parse(localStorage.getItem("_uob") as any);
    if (!userObj) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${userObj?.access_token}`,
      },
    };
    const data = {
      productid,
      quantity: purchaseAmount,
    };
    const result = await API.post("/cart?additem=1", data, config);
    if (result.data.status.localeCompare("failed") === 0) {
      return toast(result.data.msg, { autoClose: 3000, type: "error" });
    }
    if (result.data.productState === "new") {
      (setCartState as any)(Number(cartState) + 1);
    }
    toast(result.data.msg, { autoClose: 3000, type: "success" });
  }

  return (
    <ProductDetail
      {...productDetail}
      purchaseAmount={purchaseAmount}
      handleIncrease={handleIncrease}
      handleDecrease={handleDecrease}
      handlePurchaseAmountChange={handlePurchaseAmountChange}
      handleAddToCart={handleAddToCart}
    />
  );
}
