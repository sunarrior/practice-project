import React, { useState } from "react";
import { FaCcVisa } from "react-icons/fa";
import { BsCash } from "react-icons/bs";

import CheckoutItem from "@/components/checkout-item";

function CheckoutItemList({ data }: { data: any }) {
  const checkoutItemList = data.map((item: any) => {
    return (
      <CheckoutItem
        key={item.id}
        url={item.url || "/blank-image.jpg"}
        productName={item.name}
        quantity={item.quantity}
        price={item.price}
      />
    );
  });
  return <>{checkoutItemList}</>;
}

const paymentOptionDefault = {
  deliveryAddress: "",
  paymentMethod: "",
};

export default function CheckoutModal({
  data,
  handleShowModal,
}: {
  data: any;
  handleShowModal: (isShow: boolean) => void;
}): React.ReactElement {
  const [paymentOption, setPaymentOption] = useState(paymentOptionDefault);

  function handleDeliveryAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPaymentOption({ ...paymentOption, deliveryAddress: e.target.value });
  }

  function handlePaymentMethodChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPaymentOption({ ...paymentOption, paymentMethod: e.target.value });
  }

  async function handlePlaceOrder() {
    handleShowModal(false);
  }

  return (
    <>
      <div className="z-50 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto">
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
                <input
                  type="text"
                  className="w-full border-2 px-2 py-2 outline-none bg-slate-200 focus:bg-slate-50"
                  value={paymentOption.deliveryAddress}
                  placeholder="Delivery Address"
                  onChange={handleDeliveryAddressChange}
                  required
                />
                <div className="flex">
                  <div className="flex items-center pl-3">
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
