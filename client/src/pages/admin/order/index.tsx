import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import AdminOrder from "@/components/admin-order";
import AdminOrderTable from "@/components/admin-order-table";
import API from "@/config/axios.config";
import { toast } from "react-toastify";

function OrderList({
  data,
  selectedOrder,
  handleOrderSelection,
}: {
  data: any;
  selectedOrder: number[];
  handleOrderSelection: (orderid: number) => void;
}): React.ReactElement {
  const orderList = data.map((order: any) => (
    <AdminOrder
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
      url={`http://localhost:3000/admin/order/${order.id}`}
      handleOrderSelection={handleOrderSelection}
    />
  ));
  return <>{orderList}</>;
}

export default function OrderHistory(): React.ReactElement {
  const router = useRouter();
  const [orderList, setOrderList] = useState("");
  const [sortOption, setSortOption] = useState("AscOrderDay");
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const [isPerformAction, setIsPerformAction] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userObj = JSON.parse(localStorage.getItem("_uob") as any);
        if (!userObj) {
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${userObj?.access_token}`,
          },
        };
        const result = await API.get("/order/all", config);
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
      } catch (error: any) {
        toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      }
    })();
  }, [sortOption]);

  function handleSortOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value);
  }

  function handleOrderSelection(orderid: number) {
    if (selectedOrder.includes(orderid)) {
      const tmpSelectedOrder = selectedOrder.filter(
        (id: number) => id !== orderid
      );
      return setSelectedOrder(tmpSelectedOrder);
    }
    setSelectedOrder([...selectedOrder, orderid]);
  }

  async function handleChangeOrderStatus() {
    try {
      setIsPerformAction(true);
      const userObj = JSON.parse(localStorage.getItem("_uob") as any);
      if (!userObj) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
      };
      await API.put("/order", { data: selectedOrder }, config);
      router.reload();
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
      setIsPerformAction(false);
    }
  }

  async function handleCancelOrder() {
    try {
      if (selectedOrder.length === 0) {
        return toast("Please select atleast one order to cancel", {
          type: "warning",
          autoClose: 3000,
        });
      }
      setIsPerformAction(true);
      const userObj = JSON.parse(localStorage.getItem("_uob") as any);
      if (!userObj) {
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${userObj?.access_token}`,
        },
        data: selectedOrder,
      };
      await API.delete("/order", config);
      router.reload();
    } catch (error: any) {
      toast(error.response.data.msg, { type: "error", autoClose: 3000 });
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
              handleOrderSelection={handleOrderSelection}
            />
          ) : null}
        </AdminOrderTable>
      </div>
    </>
  );
}
