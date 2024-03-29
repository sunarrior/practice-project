import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { FaCcVisa } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { loadStripe, Stripe } from "@stripe/stripe-js";

import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import { PaymentMethodInfo } from "@/interface/UserData";
import { CartItemData } from "@/interface/CartData";
import {
  PlaceOrderData,
  PaymentOption,
  PaymentInfo,
} from "@/interface/OrderData";
import CheckoutItem from "@/components/checkout-item";
import PaymentMethod from "@/components/payment-method";
import API from "@/config/axios.config";
import { toast } from "react-toastify";

const stripe: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

function CheckoutItemList({
  data,
}: {
  data: CartItemData[];
}): React.ReactElement {
  const checkoutItemList: React.ReactElement[] = data.map(
    (item: CartItemData) => {
      return (
        <CheckoutItem
          key={item.id}
          url={item.url || "/blank-image.jpg"}
          productName={item.product.name}
          quantity={item.quantity}
          price={item.product.price}
        />
      );
    }
  );
  return <>{checkoutItemList}</>;
}

function PaymentMethodList({
  data,
  selectedPaymentMethod,
  onPaymentMethodTypeChange,
  onPaymentMethodTypeClick,
}: {
  data: PaymentMethodInfo[];
  selectedPaymentMethod: string;
  onPaymentMethodTypeChange: (pmId: string) => void;
  onPaymentMethodTypeClick: (pmId: string) => void;
}): React.ReactElement {
  const paymentMethodList: React.ReactElement[] = data.map(
    (paymentMethod: PaymentMethodInfo) => {
      return (
        <PaymentMethod
          key={paymentMethod.id}
          id={paymentMethod.id}
          bankType={paymentMethod.brand}
          last4={paymentMethod.last4}
          expMonth={paymentMethod.expMonth}
          expYear={paymentMethod.expYear}
          checked={paymentMethod.id === selectedPaymentMethod}
          onPaymentMethodTypeChange={onPaymentMethodTypeChange}
          onPaymentMethodTypeClick={onPaymentMethodTypeClick}
        />
      );
    }
  );
  return <>{paymentMethodList}</>;
}

const paymentOptionDefault: PaymentOption = {
  deliveryAddress: "",
  paymentMethod: "visa",
};

export default function CheckoutModal({
  data,
  handleShowModal,
  onPlaceOrder,
}: {
  data: CartItemData[];
  handleShowModal: (isShow: boolean) => void;
  onPlaceOrder: (msg: string) => void;
}): React.ReactElement {
  const [paymentOption, setPaymentOption] = useState(paymentOptionDefault);
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethodInfo[]
  >([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("new");
  const [warning, setWarning] = useState(false);

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
        const deliveryAddress: AxiosResponse = await API.get(
          "/user?option=delivery-address",
          config
        );
        const paymentList: AxiosResponse = await API.get(
          "/user/payment",
          config
        );
        setPaymentOption((curPaymentOption: PaymentOption) => {
          return {
            ...curPaymentOption,
            deliveryAddress: deliveryAddress.data.deliveryAddress || "",
          };
        });
        setPaymentMethodList(paymentList.data.paymentMethodInfo);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, []);

  function handleDeliveryAddressChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPaymentOption({ ...paymentOption, deliveryAddress: e.target.value });
  }

  function handlePaymentMethodChange(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPaymentOption({ ...paymentOption, paymentMethod: e.target.value });
  }

  function handlePaymentMethodTypeChange(pmId: string): void {
    setSelectedPaymentMethod(pmId);
  }

  function handlePaymentMethodTypeClick(pmId: string): void {
    setSelectedPaymentMethod(pmId);
  }

  async function handlePlaceOrder() {
    try {
      if (paymentOption.deliveryAddress.localeCompare("") === 0) {
        return setWarning(true);
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
      };
      const orderData: PlaceOrderData = {
        items: data,
        paymentOption,
      };

      // if visa and new payment method select, redirect to stripe checkout page
      if (paymentOption.paymentMethod.localeCompare("visa") === 0) {
        if (selectedPaymentMethod.localeCompare("new") === 0) {
          const sessionCheckout: AxiosResponse = await API.post(
            "/orders/checkout",
            orderData,
            config
          );

          ((await stripe) as Stripe).redirectToCheckout({
            sessionId: sessionCheckout.data.id,
          });
        } else {
          const paymentInfo: PaymentInfo = {
            orderData,
            selectedPaymentMethod,
          };
          const result: AxiosResponse = await API.post(
            "/orders/payment",
            paymentInfo,
            config
          );
          onPlaceOrder(result.data.msg);
        }
        return;
      }

      const result: AxiosResponse = await API.post(
        "/orders",
        orderData,
        config
      );
      onPlaceOrder(result.data.msg);
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <>
      <div className="z-50 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto overscroll-contain no-scrollbar">
        <div className="h-full max-w-3xl my-6 mx-auto relative w-full">
          {/* content */}
          <div className="max-h-full overflow-hidden border-none rounded-lg shadow-lg relative flex flex-col w-full bg-white bg-clip-padding outline-none text-current">
            {/* header */}
            <div className="items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Confirm Checkout</h3>
            </div>
            {/* body */}
            <div className="flex-auto relative overflow-y-auto p-4">
              <CheckoutItemList data={data} />
            </div>
            {/* footer */}
            <div className="border-t border-solid border-slate-200 rounded-b">
              <div className="mx-10 mt-4">
                <div className="ml-1 mb-1">
                  <p>
                    <span className="font-bold">Total: </span>
                    {data.reduce(
                      (total: number, item: any) =>
                        total + item.product.price * item.quantity,
                      0
                    )}
                    {"$"}
                  </p>
                </div>
                <input
                  type="text"
                  className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50"
                  value={paymentOption.deliveryAddress}
                  placeholder="Delivery Address"
                  onChange={handleDeliveryAddressChange}
                  required
                />
                <div className="flex">
                  <div className="flex items-center pl-1">
                    <input
                      id="visa"
                      type="radio"
                      name="payment-method"
                      value="visa"
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded hover:cursor-pointer"
                      onChange={handlePaymentMethodChange}
                      checked={
                        paymentOption.paymentMethod.localeCompare("visa") === 0
                      }
                    />
                    <label
                      htmlFor="visa"
                      className="flex w-full py-3 ml-2 text-sm font-medium text-gray-900 hover:cursor-pointer"
                    >
                      Visa <FaCcVisa size={20} className="ml-1" />
                    </label>
                  </div>
                  <div className="flex items-center pl-3">
                    <input
                      id="cash"
                      type="radio"
                      name="payment-method"
                      value="cash"
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded hover:cursor-pointer"
                      onChange={handlePaymentMethodChange}
                      checked={
                        paymentOption.paymentMethod.localeCompare("cash") === 0
                      }
                    />
                    <label
                      htmlFor="cash"
                      className="flex w-full py-3 ml-2 text-sm font-medium text-gray-900 hover:cursor-pointer"
                    >
                      Cash <BsCash size={20} className="ml-1" />
                    </label>
                  </div>
                </div>
                {paymentOption.paymentMethod.localeCompare("visa") === 0 && (
                  <>
                    <PaymentMethodList
                      data={paymentMethodList}
                      selectedPaymentMethod={selectedPaymentMethod}
                      onPaymentMethodTypeChange={handlePaymentMethodTypeChange}
                      onPaymentMethodTypeClick={handlePaymentMethodTypeClick}
                    />
                    <div
                      className="w-full border border-black h-10 bg-slate-300 hover:bg-slate-400 rounded-md relative mb-2 py-2 hover:cursor-pointer"
                      onClick={() => handlePaymentMethodTypeClick("new")}
                    >
                      <div className="absolute left-4 flex">
                        <input
                          id="new"
                          type="radio"
                          value="new"
                          name="payment-method-type"
                          className="hover:cursor-pointer"
                          onChange={() => handlePaymentMethodTypeChange("new")}
                          checked={
                            selectedPaymentMethod.localeCompare("new") === 0
                          }
                        />
                        <label
                          htmlFor="new"
                          className="ml-2 hover:cursor-pointer uppercase font-bold"
                        >
                          new
                        </label>
                      </div>
                    </div>
                  </>
                )}
                {warning && (
                  <div
                    className="bg-orange-100 border border-orange-500 text-orange-700 p-3"
                    role="alert"
                  >
                    <p>Delivey Address Cannot Be Empty</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-4">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleShowModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 hover:bg-green-400 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
