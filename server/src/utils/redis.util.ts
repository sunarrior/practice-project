import { redisClient } from "../config/redis-cache.config";

const setCache = async (
  key: string,
  value: string | number,
  maxAge: number
): Promise<void> => {
  await redisClient.set(key, value);
  await redisClient.expire(key, maxAge);
};

const getCache = async (key: string): Promise<string | null> => {
  const result: string | null = await redisClient.get(key);
  return result;
};

const clearCache = (key: string): void => {
  redisClient.del(key);
};

export { setCache, getCache, clearCache };
