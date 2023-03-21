import { Request, Response } from "express";
import Order from "../entity/Order";
import User from "../entity/User";
import orderDB from "../db/order.db";
import userDB from "../db/user.db";
import productDB from "../db/product.db";
import OrderItem from "../entity/OrderItem";

const getOrderList = async (req: Request, res: Response) => {
  try {
    const { username } = req.session;

    // check if user exists
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    const result: Order[] = await orderDB.getOrderList(user.id);
    const orderList = await Promise.all(
      result.map(async (order: any) => {
        const orderItemsInfo: OrderItem[] = await orderDB.getOrderItems(
          order.id
        );
        return {
          id: order.id,
          orderDay: order.createdAt,
          completeDay: order.completeDay,
          firstItem: orderItemsInfo[0].product.name,
          totalItems: order.orderItems.length,
          cost: order.orderItems.reduce((acc: number, item: any) => {
            return acc + item.quantity * item.price;
          }, 0),
        };
      })
    );
    res.status(200).json({ status: "success", orderList: orderList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getOrderItems = async (req: Request, res: Response) => {
  try {
    const { id: orderid } = req.params;
    const result = await orderDB.getOrderItems(orderid as unknown as number);
    const order = await orderDB.getOrderByAttrb({ id: orderid });
    const orderInfo = {
      orderDay: order?.createdAt,
      paymentDay: order?.paymentDay,
      completeDay: order?.completeDay,
      cost: order?.orderItems.reduce((acc: number, item: any) => {
        return acc + item.quantity * item.price;
      }, 0),
    };
    const orderItems = await Promise.all(
      result.map(async (item) => {
        const thumbnail = await productDB.getProductThumbnail(item.product.id);
        return {
          id: item.id,
          url: thumbnail?.url,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        };
      })
    );
    res.status(200).json({
      status: "success",
      orderItems: orderItems,
      orderInfo: orderInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getOrderList,
  getOrderItems,
};
