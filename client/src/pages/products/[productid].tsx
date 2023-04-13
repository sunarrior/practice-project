import React, { useState, useEffect, useContext } from "react";
import { useRouter, NextRouter } from "next/router";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { CartContext } from "@/context/cart.context";
import { ProductDetailData, ProductImageData } from "@/interface/ProductData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { AddCartData } from "@/interface/CartData";
import { ApiConfig } from "@/interface/ApiConfig";
import ProductDetail from "@/components/product-detail";
import API from "@/config/axios.config";

const productDetailDefault: ProductDetailData = {
  productId: 0,
  productName: "",
  productQuantity: 0,
  price: 0,
  description: "",
  imageList: [],
  categories: [],
};

export default function ProductPage(): React.ReactElement {
  const router: NextRouter = useRouter();
  const { cartState, setCartState } = useContext(CartContext);
  const [productDetail, setProductDetail] = useState(productDetailDefault);
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  const { productid } = router.query;

  useEffect((): void => {
    (async (): Promise<void> => {
      try {
        if (!productid) {
          return;
        }
        const result: AxiosResponse = await API.get(`/products/${productid}`);
        const sortImageList: ProductImageData[] =
          result.data.productDetail.imageList.sort(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (i1: ProductImageData, i2: ProductImageData) => {
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
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, [productid]);

  function handleIncrease(): void {
    if (Number(purchaseAmount + 1) <= productDetail.productQuantity) {
      setPurchaseAmount(purchaseAmount + 1);
    }
  }

  function handleDecrease(): void {
    if (Number(purchaseAmount - 1) > 0) {
      setPurchaseAmount(purchaseAmount - 1);
    }
  }

  function handlePurchaseAmountChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    if (
      Number(e.target.value) > 0 &&
      Number(e.target.value) <= productDetail.productQuantity
    ) {
      setPurchaseAmount(e.target.value as unknown as number);
    }
  }

  async function handleAddToCart(): Promise<any> {
    try {
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
      };
      const data: AddCartData = {
        productid: productid as unknown as number,
        quantity: purchaseAmount,
      };
      const result: AxiosResponse = await API.post(
        "/cart?additem=1",
        data,
        config
      );
      if (result.data.productState === "new") {
        (setCartState as any)(Number(cartState) + 1);
      }
      toast(result.data.msg, { autoClose: 3000, type: "success" });
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <ProductDetail
      {...productDetail}
      purchaseAmount={purchaseAmount as number}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onPurchaseAmountChange={handlePurchaseAmountChange}
      onAddToCart={handleAddToCart}
    />
  );
}
