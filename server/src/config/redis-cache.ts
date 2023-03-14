import { RedisClientType } from "@redis/client";
import * as redis from "redis";

export const redisClient: RedisClientType = redis.createClient({
  legacyMode: true,
});
