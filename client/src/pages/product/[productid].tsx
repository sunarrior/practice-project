import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import ProductDetail from "@/components/product-detail";
import API from "@/config/axios.config";

const productDetailDefault: {
  productName: string;
  productQuantity: number;
  price: number;
  description: string;
  imageList: [];
  categories: [];
} = {
  productName: "",
  productQuantity: 0,
  price: 0,
  description: "",
  imageList: [],
  categories: [],
};

export default function ProductPage(): React.ReactElement {
  const router = useRouter();
  const [productDetail, setProductDetail] = useState(productDetailDefault);
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  const { productid } = router.query;

  useEffect(() => {
    (async () => {
      if (!productid) {
        return;
      }
      const result = await API.get(`/product/${productid}`);
      setProductDetail({
        productName: result.data.productDetail.name || "",
        productQuantity: result.data.productDetail.quantity || "",
        price: result.data.productDetail.price || "",
        description: result.data.productDetail.description || "",
        imageList:
          result.data.productDetail.imageList.length > 0
            ? result.data.productDetail.imageList
            : ["/blank-image.jpg"],
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
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      productid,
      quantity: purchaseAmount,
    };
    await API.post("/cart?additem=1", data, config);
    router.back();
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
