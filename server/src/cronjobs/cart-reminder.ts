import { CronJob } from "cron";

import userDB from "../db/user.db";
import cartDB from "../db/cart.db";
import User from "../entity/User";
import CartItem from "../entity/CartItem";
import { CartItemMail } from "../interface/CartData";
import { mail } from "../utils";

const cartReminderCronJob = (): CronJob => {
  const cronJob: CronJob = new CronJob(
    "*/2 * * * *",
    async (): Promise<void> => {
      const users: User[] = await userDB.getAllUsers();
      await Promise.all(
        users.map(async (user: User) => {
          const cartItems: CartItem[] = await cartDB.getAllCartItems(user.id);
          const cartItemsInfo: CartItemMail[] = cartItems.map(
            (item: CartItem) => {
              return {
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              };
            }
          );
          return mail.sendCartReminderMail(user.email, cartItemsInfo);
        })
      );
    }
  );
  return cronJob;
};

export default {
  cartReminderCronJob,
};
