import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import {
  StripeCardElement,
  Stripe,
  SetupIntentResult,
} from "@stripe/stripe-js";
import React from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import API from "@/config/axios.config";

export default function AddCardModal({
  onShowModal,
  onAddPaymentMethod,
}: {
  onShowModal: (isShow: boolean) => void;
  onAddPaymentMethod: () => void;
}): React.ReactElement {
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(): Promise<void> {
    try {
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
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
      const result: AxiosResponse = await API.post(
        "/user/payment",
        null,
        config
      );
      const setupResult: SetupIntentResult = await (
        stripe as Stripe
      ).confirmCardSetup(result.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement,
        },
      });
      if (setupResult.error) {
        toast(setupResult.error.message, {
          type: "error",
          autoClose: 3000,
        });
        return;
      }
      onAddPaymentMethod();
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
    }
  }

  return (
    <>
      <div className="z-50 fixed top-20 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-hidden overscroll-contain no-scrollbar">
        <div className="h-full max-w-xl my-6 mx-auto relative w-full">
          {/* content */}
          <div className="max-h-full overflow-hidden border-none rounded-lg shadow-lg relative flex flex-col w-full bg-white bg-clip-padding outline-none text-current">
            {/* header */}
            <div className="items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Add Payment Method</h3>
            </div>
            {/* body */}
            <div className="mx-10">
              <CardElement
                id="card-element"
                className="h-14 bg-gray-30 px-3 py-5 border border-black rounded-md"
                // options={{}}
                // onChange={handleChange}
              />
            </div>
            {/* footer */}
            <div className="border-t border-solid border-slate-200 rounded-b">
              <div className="flex items-center justify-end p-4">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => onShowModal(false)}
                >
                  Cancle
                </button>
                <button
                  className="bg-green-500 hover:bg-green-400 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleSubmit()}
                >
                  Add Payment Method
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
