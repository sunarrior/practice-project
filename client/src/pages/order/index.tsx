import React, { useState, useEffect } from "react";

import Order from "@/components/order";
import OrderTable from "@/components/order-table";
import API from "@/config/axios.config";

function OrderList({ data }: { data: any }): React.ReactElement {
  const orderList = data.map((order: any) => (
    <Order
      key={order.id}
      orderid={order.id}
      orderDay={new Date(order.orderDay).toLocaleString()}
      completedDay={order.completeDay}
      firstItem={order.firstItem}
      totalItem={order.totalItems}
      cost={order.cost}
      url={`http://localhost:3000/order/${order.id}`}
    />
  ));
  return <>{orderList}</>;
}

export default function OrderHistory(): React.ReactElement {
  const [orderList, setOrderList] = useState("");
  const [sortOption, setSortOption] = useState("AscOrderDay");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const result = await API.get("/order", config);
        const sortOrderList = result.data.orderList.sort((o1: any, o2: any) => {
          if (sortOption === "DesOrderDay") {
            return o2.createdAt - o1.createdAt;
          }
          if (sortOption === "AscCost") {
            return o1.cost - o2.cost;
          }
          if (sortOption === "DescCost") {
            return o2.cost - o1.cost;
          }
          return o1.createdAt - o2.createdAt;
        });
        setOrderList(sortOrderList);
      } catch (error) {
        // do something
      }
    })();
  }, [sortOption]);

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  return (
    <>
      <div className="my-14">
        <div className="mx-10 mb-2 w-1/4">
          <select
            id="sort-option"
            className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={handleSortOptionChange}
          >
            <option value="AscOrderDay" defaultValue="AscOrderDay">
              Ascending by order day
            </option>
            <option value="DescOrderDay">Descending by order day</option>
            <option value="AscCost">Ascending by cost</option>
            <option value="DescCost">Descending by cost</option>
          </select>
        </div>
        <OrderTable>
          {orderList ? <OrderList data={orderList} /> : null}
        </OrderTable>
      </div>
    </>
  );
}
