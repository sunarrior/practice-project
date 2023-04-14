import { Request, Response } from "express";

import { common, orderConstant } from "../constant/controller.constant";
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
import { CartItemData } from "../interface/CartData";
import { OrderData, OrderItemData } from "../interface/OrderData";
import { mail } from "../utils";

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result: Order[] = await orderDB.getAllOrders();
    const orderList: OrderData[] = result.map((order: Order) => {
      order.orderItems.sort((i1: OrderItem, i2: OrderItem) => i1.id - i2.id);
      return {
        id: order.id,
        username: order.user.username,
        paymentMethod: order.paymentMethod,
        orderDay: order.createdAt,
        completeDay: order.completeDay || undefined,
        firstItem: order.orderItems[0].product.name,
        totalItems: order.orderItems.length,
        cost: order.orderItems.reduce((acc: number, item: OrderItem) => {
          return acc + item.quantity * item.price;
        }, 0),
      };
    });
    res.status(200).json({ orderList });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const getOrderListByUserId = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = req.id;

    // check if user exists
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    const result: Order[] = await orderDB.getOrderListByUserId(user.id);
    const orderList: OrderData[] = result.map((order: Order) => {
      order.orderItems.sort((i1: OrderItem, i2: OrderItem) => i1.id - i2.id);
      return {
        id: order.id,
        paymentMethod: order.paymentMethod,
        orderDay: order.createdAt,
        completeDay: order.completeDay || undefined,
        firstItem: order.orderItems[0].product.name,
        totalItems: order.orderItems.length,
        cost: order.orderItems.reduce((acc: number, item: OrderItem) => {
          return acc + item.quantity * item.price;
        }, 0),
      };
    });
    res.status(200).json({ orderList });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
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
    const orderInfo: OrderData = {
      username: order?.user.username,
      paymentMethod: order?.paymentMethod as string,
      orderDay: order?.createdAt as Date,
      paymentDay: order?.paymentDay || undefined,
      completeDay: order?.completeDay || undefined,
      cost: order?.orderItems.reduce((acc: number, item: OrderItem) => {
        return acc + item.quantity * item.price;
      }, 0) as number,
    };
    const orderItems: OrderItemData[] = await Promise.all(
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
    orderItems.sort((i1: OrderItemData, i2: OrderItemData) => i1.id - i2.id);
    res.status(200).json({
      orderInfo,
      orderItems,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = req.id;
    const { items, paymentOption } = req.body;

    // check if user exists
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        msg: common.USER_BLOCKED,
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
    const orderItems: OrderItem[] = await Promise.all(
      items.map(async (item: CartItemData) => {
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
        const orderItem: OrderItem = new OrderItem();
        orderItem.quantity = item.quantity;
        orderItem.price = item.product.price;
        orderItem.order = order;
        orderItem.product = product;

        // update product quantity
        const newProductState: Product = {
          ...product,
          quantity: product.quantity - item.quantity,
        };
        await productDB.updateProduct(product.id, newProductState);

        return orderItem;
      })
    );
    const orderItemsFilter: OrderItem[] = orderItems.filter(
      (item: OrderItem) => item !== null || item !== undefined
    );
    await orderDB.addOrderItem(orderItemsFilter);

    // remove item in cart
    const cartItemsCheckout: CartItem[] = cartItems.filter((item: CartItem) => {
      for (let i = 0; i < items.length; i += 1) {
        if (item.id === items[i].id) {
          return true;
        }
      }
      return false;
    });
    await cartDB.removeItem(cartItemsCheckout);

    // send mail to user
    mail.sendPlaceOrderMail(user.email, items, paymentOption);

    res.status(200).json({ msg: orderConstant.PLACE_ORDER_SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const updateOrders = async (req: Request, res: Response) => {
  try {
    const orderids: number[] = req.body.selectedOrder;
    const updateOrderList: (Order | undefined)[] = await Promise.all(
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
    res.status(201).json({ msg: orderConstant.UPDATE_SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const cancelOrders = async (req: Request, res: Response) => {
  try {
    const orderids: number[] = req.body;
    const cancelOrderList: (Order | undefined)[] = await Promise.all(
      orderids.map(async (id: number) => {
        const order: Order | null = await orderDB.getOrderById(id);
        if (!order) {
          return undefined;
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
    for (let i = 0; i < cancelOrderListFilter.length; i += 1) {
      if (cancelOrderListFilter[i]?.completeDay) {
        return res.status(400).json({
          msg: orderConstant.CANNOT_CANCEL_COMPLETED,
        });
      }
    }
    await orderDB.removeOrders(cancelOrderListFilter as Order[]);
    res.status(200).json({ msg: orderConstant.CANCEL_SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
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
