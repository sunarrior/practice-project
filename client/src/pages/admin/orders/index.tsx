import React, { useState, useEffect } from "react";
import { useRouter, NextRouter } from "next/router";
import { AxiosResponse } from "axios";

import { OrderData, SelectedOrder } from "@/interface/OrderData";
import { UserObjectLS } from "@/interface/LocalStorageData";
import { ApiConfig } from "@/interface/ApiConfig";
import { orderConstant } from "@/constant/order.constant";
import AdminOrderRow from "@/components/admin-order-row";
import AdminOrderTable from "@/components/admin-order-table";
import API from "@/config/axios.config";
import { toast } from "react-toastify";

function OrderList({
  data,
  selectedOrder,
  onOrderSelection,
}: {
  data: OrderData[];
  selectedOrder: number[];
  onOrderSelection: (orderid: number) => void;
}): React.ReactElement {
  const orderList = data.map((order: any) => (
    <AdminOrderRow
      key={order.id}
      isSelected={selectedOrder.includes(order.id)}
      orderid={order.id}
      username={order.username}
      paymentMethod={order.paymentMethod}
      orderDay={new Date(order.orderDay).toLocaleString()}
      completedDay={
        order.completeDay
          ? new Date(order.completeDay).toLocaleString()
          : undefined
      }
      firstItem={order.firstItem}
      totalItem={order.totalItems}
      cost={order.cost}
      url={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/admin/orders/${order.id}`}
      onOrderSelection={onOrderSelection}
    />
  ));
  return <>{orderList}</>;
}

export default function OrderHistory(): React.ReactElement {
  const router: NextRouter = useRouter();
  const [orderList, setOrderList] = useState<OrderData[]>([]);
  const [sortOption, setSortOption] = useState("AscOrderDay");
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [isPerformAction, setIsPerformAction] = useState(false);

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
        const result: AxiosResponse = await API.get("/orders/all", config);
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

  function handleOrderSelection(orderid: number): void {
    if (selectedOrder.includes(orderid)) {
      const tmpSelectedOrder: number[] = selectedOrder.filter(
        (id: number) => id !== orderid
      );
      return setSelectedOrder(tmpSelectedOrder);
    }
    setSelectedOrder([...selectedOrder, orderid]);
  }

  async function handleChangeOrderStatus(): Promise<any> {
    try {
      if (selectedOrder.length === 0) {
        return toast(orderConstant.SELECT_FOR_CHANGE_STATUS, {
          type: "warning",
          autoClose: 3000,
        });
      }
      setIsPerformAction(true);
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
      const data: SelectedOrder = {
        selectedOrder,
      };
      await API.put("/orders", data, config);
      router.reload();
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
      setIsPerformAction(false);
    }
  }

  async function handleCancelOrder(): Promise<any> {
    try {
      if (selectedOrder.length === 0) {
        return toast(orderConstant.SELECT_FOR_DELETE, {
          type: "warning",
          autoClose: 3000,
        });
      }
      setIsPerformAction(true);
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
        data: selectedOrder,
      };
      await API.delete("/orders", config);
      router.reload();
    } catch (error: any) {
      toast(error.response?.data?.msg || error.message, {
        type: "error",
        autoClose: 3000,
      });
      setIsPerformAction(false);
    }
  }

  return (
    <>
      <div className="my-14">
        <div className="mx-10 mb-2 flex">
          <div className="w-1/4">
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
          <div className="flex w-3/4 justify-end">
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 font-bold text-white rounded-md"
              onClick={handleChangeOrderStatus}
              disabled={isPerformAction}
            >
              Change To Completed/Incompleted
            </button>
            <button
              className="ml-1 px-4 py-2 bg-red-500 hover:bg-red-400 font-bold text-white rounded-md"
              onClick={handleCancelOrder}
              disabled={isPerformAction}
            >
              Cancel Order
            </button>
          </div>
        </div>
        <AdminOrderTable>
          {orderList ? (
            <OrderList
              data={orderList}
              selectedOrder={selectedOrder}
              onOrderSelection={handleOrderSelection}
            />
          ) : (
            <></>
          )}
        </AdminOrderTable>
      </div>
    </>
  );
}
