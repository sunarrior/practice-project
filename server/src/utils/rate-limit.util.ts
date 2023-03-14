import {
  RateLimiterRedis,
  IRateLimiterRedisOptions,
} from "rate-limiter-flexible";
import { redisClient } from "../config/redis-cache";

const opts: IRateLimiterRedisOptions = {
  storeClient: redisClient,
  points: 3, // 5 points
  duration: 50 * 60, // Per 15 minutes
  blockDuration: 50 * 60, // block for 15 minutes if more than points consumed
};

const loginAttemps: RateLimiterRedis = new RateLimiterRedis(opts);

export { loginAttemps };
