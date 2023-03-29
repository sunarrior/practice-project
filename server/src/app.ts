import express from "express";
import cors from "cors";
import RedisStore from "connect-redis";
import session from "express-session";

import EnvConfig from "./config/env.config";
import { redisClient } from "./config/redis-cache";
import router from "./routes/index";
import cartReminder from "./cronjobs/cart-reminder";

const redisStore: any = new (RedisStore as any)({ client: redisClient });
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(
  session({
    store: redisStore,
    secret: EnvConfig.SESSION_SECRET,
    name: "_rsi",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// cartReminder.cartReminderCronJob().start();

app.use("/api/v1", router);

export default app;
