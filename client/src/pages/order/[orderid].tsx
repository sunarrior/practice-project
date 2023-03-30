import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import OrderItem from "@/components/order-item";
import API from "@/config/axios.config";

const defaultOrderInfo: {
  orderDay: string;
  paymentDay: string;
  completeDay: string;
  cost: number;
} = {
  orderDay: "",
  paymentDay: "",
  completeDay: "",
  cost: 0,
};

function OrderItemList({ data }: { data: any }): React.ReactElement {
  const orderItemsList = data.map((item: any) => {
    return (
      <OrderItem
        key={item.id}
        url={item.url || "/blank-image.jpg"}
        productName={item.productName}
        quantity={item.quantity}
        price={item.price}
      />
    );
  });
  return <>{orderItemsList}</>;
}

export default function OrderDetail() {
  const router = useRouter();

  const [orderInfo, setOrderInfo] = useState(defaultOrderInfo);
  const [orderItems, setOrderItems] = useState();

  const { orderid } = router.query;

  useEffect(() => {
    (async () => {
      const userObj = JSON.parse(localStorage.getItem("_uob") as any);
      if (!userObj) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
      };

      if (!orderid) {
        return;
      }
      const result = await API.get(`/order/${orderid}`, config);
      setOrderInfo({
        orderDay: result.data.orderInfo.orderDay
          ? new Date(result.data.orderInfo.orderDay).toLocaleString()
          : "",
        paymentDay: result.data.orderInfo.paymentDay
          ? new Date(result.data.orderInfo.paymentDay).toLocaleString()
          : "",
        completeDay: result.data.orderInfo.completeDay
          ? new Date(result.data.orderInfo.completeDay).toLocaleString()
          : "",
        cost: result.data.orderInfo.cost || 0,
      });
      setOrderItems(result.data.orderItems);
    })();
  }, [orderid]);

  return (
    <>
      <div className="my-10 relative overflow-x-auto shadow-md mx-10 rounded-md">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-orange-500">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3">
                Order Day
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Day
              </th>
              <th scope="col" className="px-6 py-3">
                Completed Day
              </th>
              <th scope="col" className="px-6 py-3">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-300 border-b font-medium">
              <td className="px-6 py-4">{orderid}</td>
              <td className="px-6 py-4">{orderInfo.orderDay}</td>
              <td className="px-6 py-4">
                {orderInfo.paymentDay || "Not yet payment"}
              </td>
              <td className="px-6 py-4">
                {orderInfo.completeDay || "Not yet completed"}
              </td>
              <td className="px-6 py-4">{orderInfo.cost}$</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container max-w-full mx-52 my-12 px-4">
        <div className="flex flex-wrap">
          {orderItems ? <OrderItemList data={orderItems} /> : null}
        </div>
      </div>
    </>
  );
}
