import React, { useState, useEffect, useContext } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { CartContext } from "@/context/cart.context";
import { CartItemData } from "@/interface/CartData";
import { ApiConfig } from "@/interface/ApiConfig";
import { UserObjectLS } from "@/interface/LocalStorageData";
import API from "@/config/axios.config";
import { AiOutlineShopping } from "react-icons/ai";
import CartItem from "@/components/cart-item";
import CheckoutModal from "@/components/checkout-modal";

function CartItemList({
  data,
  checkedItems,
  handleItemClick,
  handleCheckboxChange,
}: {
  data: CartItemData[];
  checkedItems: number[];
  handleItemClick: (id: number) => void;
  handleCheckboxChange: (id: number) => void;
}): React.ReactElement {
  const cartItemList = data.map((cartProduct: any) => {
    return (
      <CartItem
        key={cartProduct.id}
        id={cartProduct.id}
        checkedItem={checkedItems.includes(cartProduct.id)}
        url={cartProduct.url || "/blank-image.jpg"}
        productName={cartProduct.product.name}
        quantity={cartProduct.quantity || 0}
        price={cartProduct.product.price}
        handleItemClick={handleItemClick}
        handleCheckboxChange={handleCheckboxChange}
      />
    );
  });
  return <>{cartItemList}</>;
}

export default function Cart(): React.ReactElement {
  const { setCartState } = useContext(CartContext);
  const [cartItemList, setCartItemList] = useState<CartItemData[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect((): void => {
    (async (): Promise<void> => {
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
        const products: AxiosResponse = await API.get("/cart", config);
        setCartItemList(products.data.cartItems);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, []);

  function handleItemClick(key: number): void {
    if (!checkedItems.includes(key)) {
      return setCheckedItems([...checkedItems, key]);
    }
    setCheckedItems(checkedItems.filter((item: number) => item !== key));
  }

  function handlleCheckboxChange(key: number): void {
    if (!checkedItems.includes(key)) {
      return setCheckedItems([...checkedItems, key]);
    }
    setCheckedItems(checkedItems.filter((item: number) => item !== key));
  }

  function handleShowModal(state: boolean): void {
    if (checkedItems.length > 0) {
      setShowModal(state);
    }
  }

  function handlePlaceOrder(msg: string): void {
    (setCartState as any)(cartItemList.length - checkedItems.length);
    setCartItemList(
      cartItemList.filter(
        (item: CartItemData) => !checkedItems.includes(item.id)
      )
    );
    setCheckedItems([]);
    handleShowModal(false);
    toast(msg, { autoClose: 3000, type: "success" });
  }

  async function handleRemoveItem(): Promise<void> {
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
        data: checkedItems,
      };
      await API.delete("/cart", config);
      (setCartState as any)(cartItemList.length - checkedItems.length);
      setCartItemList(
        cartItemList.filter(
          (item: CartItemData) => !checkedItems.includes(item.id)
        )
      );
      setCheckedItems([]);
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <>
      {showModal && (
        <>
          <CheckoutModal
            data={cartItemList.filter((item: CartItemData) =>
              checkedItems.includes(item.id)
            )}
            handleShowModal={handleShowModal}
            onPlaceOrder={handlePlaceOrder}
          />
        </>
      )}
      <div className="mx-10 my-10">
        <div className="flex relative justify-center">
          <h1 className="uppercase text-3xl font-bold">Cart</h1>
          <AiOutlineShopping className="ml-1" size={35} />
          {checkedItems.length > 0 && (
            <div className="absolute right-40">
              <button
                type="button"
                className="shadow-md px-4 py-2 bg-green-500 hover:bg-green-400 rounded-md text-white font-bold"
                onClick={() => handleShowModal(true)}
              >
                Checkout
              </button>
              <button
                type="button"
                className="shadow-md px-4 py-2 bg-red-500 hover:bg-red-400 rounded-md ml-2 text-white font-bold"
                onClick={handleRemoveItem}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <div className="w-3/4 mx-44">
          <div className="max-w-full mx-6 my-2">
            <div className="flex flex-wrap">
              {cartItemList ? (
                <CartItemList
                  data={cartItemList}
                  checkedItems={checkedItems}
                  handleItemClick={handleItemClick}
                  handleCheckboxChange={handlleCheckboxChange}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
