import Order from "../entity/Order";
import OrderItem from "../entity/OrderItem";
import { dataSource } from "../config/data-source.config";

const orderRepos = dataSource.getRepository(Order);
const orderItemRepos = dataSource.getRepository(OrderItem);

const getAllOrders = async (): Promise<Order[]> => {
  const result: Order[] = await orderRepos.find({
    relations: {
      user: true,
      orderItems: {
        product: true,
      },
    },
  });
  return result;
};

const getOrderListByUserId = async (userid: number): Promise<Order[]> => {
  const result: Order[] = await orderRepos.find({
    relations: {
      orderItems: {
        product: true,
      },
    },
    where: {
      user: {
        id: userid,
      },
    },
  });
  return result;
};

const getOrderById = async (orderid: number): Promise<Order | null> => {
  const result: Order | null = await orderRepos.findOne({
    relations: {
      user: true,
      orderItems: true,
    },
    where: {
      id: orderid,
    },
  });
  return result;
};

const getOrderItems = async (orderid: number): Promise<OrderItem[]> => {
  const result: OrderItem[] = await orderItemRepos.find({
    relations: {
      product: true,
    },
    where: {
      order: {
        id: orderid,
      },
    },
  });
  return result;
};

const createOrder = async (order: Order): Promise<void> => {
  await orderRepos.save(order);
};

const addOrderItem = async (orderItems: OrderItem[]): Promise<void> => {
  await orderItemRepos.save(orderItems);
};

const updateOrders = async (order: Order[]): Promise<void> => {
  await orderRepos.save(order);
};

const removeOrders = async (order: Order[]): Promise<void> => {
  await orderRepos.remove(order);
};

export default {
  getAllOrders,
  getOrderListByUserId,
  getOrderById,
  getOrderItems,
  createOrder,
  addOrderItem,
  updateOrders,
  removeOrders,
};
