import { Request, Response } from "express";
import { Stripe } from "stripe";

import User from "../entity/User";
import Product from "../entity/Product";
import CartItem from "../entity/CartItem";
import Order from "../entity/Order";
import OrderItem from "../entity/OrderItem";
import { CartItemData } from "../interface/CartData";
import { PaymentOption } from "../interface/OrderData";
import userDB from "../db/user.db";
import productDB from "../db/product.db";
import cartDB from "../db/cart.db";
import orderDB from "../db/order.db";
import stripe from "../config/stripe.config";
import EnvConfig from "../config/env.config";
import { mail } from "../utils";

const endPointSecret: string = EnvConfig.STRIPE_WEBHOOK_SECRET;

const fulfillOrder = async (
  id: number,
  items: CartItemData[],
  paymentOption: PaymentOption
) => {
  const user: User | null = await userDB.getUserById(id);

  // check item in cart
  const cartItems: CartItem[] = await cartDB.getAllCartItems(
    user?.id as number
  );
  const cartItemIds: number[] = cartItems.map((item: CartItem) => item.id);

  // create order
  const order: Order = new Order();
  order.paymentMethod = paymentOption.paymentMethod;
  order.paymentDay = new Date();
  order.deliveryAddress = paymentOption.deliveryAddress;
  order.status = "pending";
  order.user = user as User;
  await orderDB.createOrder(order);

  // add order item
  const orderItems: (OrderItem | undefined)[] = await Promise.all(
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
  const orderItemsFilter: (OrderItem | undefined)[] = orderItems.filter(
    (item: OrderItem | undefined) => item !== null || item !== undefined
  );
  await orderDB.addOrderItem(orderItemsFilter as OrderItem[]);

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
  mail.sendPlaceOrderMail(user?.email as string, items, paymentOption);
};

const webhookStripe = (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    const event: Stripe.Event = stripe.webhooks.constructEvent(
      payload.toString(),
      sig as any,
      endPointSecret
    );
    switch (event.type) {
      case "payment_intent.requires_action":
        break;
      case "payment_intent.payment_failed":
        break;
      case "payment_intent.succeeded": {
        const paymentIntent: any = event.data.object;
        if (!paymentIntent.metadata?.items) {
          return res.status(200).end();
        }
        const id: number = Number(paymentIntent.metadata.userid);
        const items: CartItemData[] = JSON.parse(paymentIntent.metadata.items);
        const paymentOption: PaymentOption = JSON.parse(
          paymentIntent.metadata.paymentOption
        );
        fulfillOrder(id, items, paymentOption);
        break;
      }
      case "checkout.session.completed": {
        const session: any = event.data.object;
        const id: number = Number(session.metadata.userid);
        const items: CartItemData[] = JSON.parse(session.metadata.items);
        const paymentOption: PaymentOption = JSON.parse(
          session.metadata.paymentOption
        );
        fulfillOrder(id, items, paymentOption);
        break;
      }
      default:
        break;
    }

    res.status(200).end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

export default {
  webhookStripe,
};
