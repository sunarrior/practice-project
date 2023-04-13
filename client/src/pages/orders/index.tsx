import React, { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

import { OrderData } from "@/interface/OrderData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import OrderRow from "@/components/order-row";
import OrderTable from "@/components/order-table";
import API from "@/config/axios.config";

function OrderList({ data }: { data: OrderData[] }): React.ReactElement {
  const orderList: React.ReactElement[] = data.map((order: OrderData) => (
    <OrderRow
      key={order.id}
      orderid={order.id as number}
      paymentMethod={order.paymentMethod}
      orderDay={new Date(order.orderDay).toLocaleString()}
      completedDay={
        order.completeDay
          ? new Date(order.completeDay).toLocaleString()
          : undefined
      }
      firstItem={order.firstItem as string}
      totalItem={order.totalItems as number}
      cost={order.cost}
      url={`http://localhost:3000/orders/${order.id}`}
    />
  ));
  return <>{orderList}</>;
}

export default function OrderHistory(): React.ReactElement {
  const [orderList, setOrderList] = useState<OrderData[]>([]);
  const [sortOption, setSortOption] = useState("AscOrderDay");

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
        const result: AxiosResponse = await API.get("/orders", config);
        const sortOrderList: OrderData[] = result.data.orderList.sort(
          (o1: OrderData, o2: OrderData) => {
            if (sortOption === "DescOrderDay") {
              return (
                new Date(o2.orderDay).getTime() -
                new Date(o1.orderDay).getTime()
              );
            }
            if (sortOption === "AscCost") {
              return o1.cost - o2.cost;
            }
            if (sortOption === "DescCost") {
              return o2.cost - o1.cost;
            }
            return (
              new Date(o1.orderDay).getTime() - new Date(o2.orderDay).getTime()
            );
          }
        );
        // console.log(sortOrderList);
        setOrderList(sortOrderList);
      } catch (error: any) {
        toast(error.response?.data?.msg || error.message, {
          type: "error",
          autoClose: 3000,
        });
      }
    })();
  }, [sortOption]);

  function handleSortOptionChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ): void {
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
