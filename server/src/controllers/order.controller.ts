/* eslint-disable prefer-destructuring */
import { Request, Response } from "express";
import Order from "../entity/Order";
import User from "../entity/User";
import orderDB from "../db/order.db";
import userDB from "../db/user.db";
import cartDB from "../db/cart.db";
import productDB from "../db/product.db";
import OrderItem from "../entity/OrderItem";
import ProductImage from "../entity/ProductImage";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
import { mail } from "../utils";

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result: Order[] = await orderDB.getAllOrders();
    const orderList = result.map((order: Order) => {
      order.orderItems.sort((i1, i2) => i1.id - i2.id);
      return {
        id: order.id,
        username: order.user.username,
        paymentMethod: order.paymentMethod,
        orderDay: order.createdAt,
        completeDay: order.completeDay || undefined,
        firstItem: order.orderItems[0].product.name,
        totalItems: order.orderItems.length,
        cost: order.orderItems.reduce((acc: number, item: any) => {
          return acc + item.quantity * item.price;
        }, 0),
      };
    });
    res.status(200).json({ status: "success", orderList: orderList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getOrderListByUserId = async (req: Request, res: Response) => {
  try {
    const username: string | undefined = req.username;

    // check if user exists
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    const result: Order[] = await orderDB.getOrderListByUserId(user.id);
    const orderList = result.map((order: Order) => {
      order.orderItems.sort((i1, i2) => i1.id - i2.id);
      return {
        id: order.id,
        paymentMethod: order.paymentMethod,
        orderDay: order.createdAt,
        completeDay: order.completeDay,
        firstItem: order.orderItems[0].product.name,
        totalItems: order.orderItems.length,
        cost: order.orderItems.reduce((acc: number, item: any) => {
          return acc + item.quantity * item.price;
        }, 0),
      };
    });
    res.status(200).json({ status: "success", orderList: orderList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getOrderItems = async (req: Request, res: Response) => {
  try {
    const { id: orderid } = req.params;
    const result: OrderItem[] = await orderDB.getOrderItems(
      orderid as unknown as number
    );
    const order: Order | null = await orderDB.getOrderById(
      orderid as unknown as number
    );
    const orderInfo = {
      username: order?.user.username,
      paymentMethod: order?.paymentMethod,
      orderDay: order?.createdAt,
      paymentDay: order?.paymentDay,
      completeDay: order?.completeDay,
      cost: order?.orderItems.reduce((acc: number, item: any) => {
        return acc + item.quantity * item.price;
      }, 0),
    };
    const orderItems = await Promise.all(
      result.map(async (item: OrderItem) => {
        const thumbnail: ProductImage = await productDB.getProductThumbnail(
          item.product.id
        );
        return {
          id: item?.id,
          url: thumbnail?.url,
          productName: item?.product?.name,
          quantity: item?.quantity,
          price: item?.price,
        };
      })
    );
    orderItems.sort((i1, i2) => i1.id - i2.id);
    res.status(200).json({
      status: "success",
      orderInfo: orderInfo,
      orderItems: orderItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const username: string | undefined = req.username;
    const { items, paymentOption } = req.body;

    // check if user exists
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(200).json({
        status: "failed",
        msg: "User is blocked from doing this action",
      });
    }

    // check item in cart
    const cartItems: CartItem[] = await cartDB.getAllCartItems(user.id);
    const cartItemIds: number[] = cartItems.map((item: CartItem) => item.id);

    // create order
    const order: Order = new Order();
    order.paymentMethod = paymentOption.paymentMethod;
    if (paymentOption.paymentMethod.localeCompare("visa") === 0) {
      order.paymentDay = new Date();
    }
    order.deliveryAddress = paymentOption.deliveryAddress;
    order.status = "pending";
    order.user = user;
    orderDB.createOrder(order);

    // add order item
    let orderItems: OrderItem[] = await Promise.all(
      items.map(async (item: any) => {
        // check if item not in cart
        if (!cartItemIds.includes(Number(item.id))) {
          return;
        }

        // check if product is valid
        const product: Product | null = await productDB.getProductById(
          item.product.id
        );
        if (!product) {
          return;
        }

        // add order item
        const orderItem = new OrderItem();
        orderItem.quantity = item.quantity;
        orderItem.price = item.product.price;
        orderItem.order = order;
        orderItem.product = product;

        // update product quantity
        const newProductState = {
          ...product,
          quantity: product.quantity - item.quantity,
        };
        await productDB.updateProduct(product.id, newProductState);

        return orderItem;
      })
    );
    orderItems = orderItems.filter(
      (item: OrderItem) => item !== null || item !== undefined
    );
    await orderDB.addOrderItem(orderItems);

    // remove item in cart
    const cartItemsCheckout: CartItem[] = cartItems.filter((item: CartItem) => {
      for (const i of items) {
        if (i.id === item.id) {
          return true;
        }
      }
      return false;
    });
    await cartDB.removeItem(cartItemsCheckout);

    // send mail to user
    mail.sendPlaceOrderMail(user.email, items, paymentOption);

    res
      .status(200)
      .json({ status: "success", msg: "Place Order Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const updateOrders = async (req: Request, res: Response) => {
  try {
    const orderids: number[] = req.body.data;
    const updateOrderList = await Promise.all(
      orderids.map(async (id: number) => {
        const order: Order | null = await orderDB.getOrderById(id);
        if (!order) {
          return;
        }
        if (!order.completeDay) {
          if (order.paymentMethod.localeCompare("visa") === 0) {
            return {
              ...order,
              completeDay: new Date(),
              status: "completed",
            };
          }
          return {
            ...order,
            completeDay: new Date(),
            paymentDay: new Date(),
            status: "completed",
          };
        }
        if (order.paymentMethod.localeCompare("visa") === 0) {
          return {
            ...order,
            completeDay: null,
            status: "pending",
          };
        }
        return {
          ...order,
          completeDay: null,
          paymentDay: null,
          status: "pending",
        };
      })
    );
    const updateOrderListFilter: (Order | undefined)[] = updateOrderList.filter(
      (order: Order | undefined) => order
    );
    await orderDB.updateOrders(updateOrderListFilter as Order[]);
    res
      .status(200)
      .json({ stauts: "success", msg: "Order updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const cancelOrders = async (req: Request, res: Response) => {
  try {
    const orderids: number[] = req.body;
    const cancelOrderList = await Promise.all(
      orderids.map(async (id: number) => {
        const order: Order | null = await orderDB.getOrderById(id);
        if (!order) {
          return;
        }
        if (!order.completeDay) {
          return {
            ...order,
            status: "canceled",
          };
        }
        return order;
      })
    );
    const cancelOrderListFilter: (Order | undefined)[] = cancelOrderList.filter(
      (order: Order | undefined) => order
    );
    for (const order of cancelOrderListFilter) {
      if (order?.completeDay) {
        return res.status(400).json({
          status: "failed",
          msg: "Cannot cancel completed order",
        });
      }
    }
    await orderDB.removeOrders(cancelOrderListFilter as Order[]);
    res
      .status(200)
      .json({ stauts: "success", msg: "Order cancel successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getAllOrders,
  getOrderListByUserId,
  getOrderItems,
  createOrder,
  updateOrders,
  cancelOrders,
};
