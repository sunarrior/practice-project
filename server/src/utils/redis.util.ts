import { redisClient } from "../config/redis-cache";

const setCache = async (
  key: string,
  value: string | number,
  maxAge: number
): Promise<void> => {
  await redisClient.set(key, value);
  await redisClient.expire(key, maxAge);
};

const getCache = async (key: string): Promise<any> => {
  // return new Promise((resolve, reject) => {
  //   redisClient.v4.get(key);
  // });
  const result = redisClient.v4.get(key);
  return result;
};

const clearCache = (key: string): void => {
  redisClient.del(key);
};

export { setCache, getCache, clearCache };
