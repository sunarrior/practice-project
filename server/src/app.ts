import express from "express";
import cors from "cors";
import RedisStore from "connect-redis";
// import connectRedis from "connect-redis";
import session from "express-session";

import EnvConfig from "./config/env.config";
import { redisClient } from "./config/redis-cache";
import router from "./routes/index";

// const RedisStore = connectRedis(session);
// const redisStore = new RedisStore({ client: redisClient });
const redisStore: any = new (RedisStore as any)({ client: redisClient });
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      maxAge: 50 * 60 * 1000,
    },
  })
);

app.use("/api/v1", router);

export default app;
