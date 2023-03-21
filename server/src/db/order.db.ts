import Order from "../entity/Order";
import OrderItem from "../entity/OrderItem";
import { dataSource } from "../config/data-source.config";

const orderRepos = dataSource.getRepository(Order);
const orderItemRepos = dataSource.getRepository(OrderItem);

const getOrderList = async (userid: number): Promise<Order[]> => {
  const result: Order[] = await orderRepos.find({
    relations: {
      orderItems: true,
    },
    where: {
      user: {
        id: userid,
      },
    },
  });
  return result;
};

const getOrderByAttrb = async (data: any): Promise<Order | null> => {
  const result: Order | null = await orderRepos.findOne({
    relations: {
      orderItems: true,
    },
    where: {
      id: data?.id,
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

export default {
  getOrderList,
  getOrderByAttrb,
  getOrderItems,
};
