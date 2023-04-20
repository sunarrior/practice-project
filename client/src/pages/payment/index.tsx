import { useState, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { MdPayment } from "react-icons/md";
import { AxiosResponse } from "axios";

import AddCardModal from "@/components/add-card-modal";
import PaymentMethod from "@/components/payment-method";
import { PaymentMethodInfo } from "@/interface/UserData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import API from "@/config/axios.config";

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

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

export default function Payment() {
  const router: NextRouter = useRouter();
  const [paymentMethodList, setPaymentMethodList] = useState<
    PaymentMethodInfo[]
  >([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
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
      const result: AxiosResponse = await API.get("/user/payment", config);
      setPaymentMethodList(result.data.paymentMethodInfo);
    })();
  }, []);

  function handleShowModal(state: boolean): void {
    setShowModal(state);
  }

  function handleAddPaymentMethod() {
    setShowModal(false);
    router.reload();
  }

  function handlePaymentMethodTypeChange(pmId: string): void {
    setSelectedPaymentMethod(pmId);
  }

  function handlePaymentMethodTypeClick(pmId: string): void {
    setSelectedPaymentMethod(pmId);
  }

  return (
    <>
      {showModal && (
        <Elements stripe={stripePromise}>
          <AddCardModal
            onShowModal={handleShowModal}
            onAddPaymentMethod={handleAddPaymentMethod}
          />
        </Elements>
      )}
      <div className="mx-10 my-10">
        <div>
          <div className="flex relative justify-center">
            <div className="flex mt-5">
              <h1 className="uppercase text-3xl font-bold">Payment Method</h1>
              <MdPayment size={35} className="ml-1 mt-[2px]" />
            </div>
            <div className="absolute top-0 right-40">
              <button
                className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-md font-bold text-white"
                onClick={() => handleShowModal(true)}
              >
                Add Payment Method
              </button>
            </div>
          </div>
          <div className="mt-10 w-1/2 mx-auto">
            {paymentMethodList.length > 0 && (
              <>
                <PaymentMethodList
                  data={paymentMethodList}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onPaymentMethodTypeChange={handlePaymentMethodTypeChange}
                  onPaymentMethodTypeClick={handlePaymentMethodTypeClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
