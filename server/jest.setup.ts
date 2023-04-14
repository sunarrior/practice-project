import { Repository } from "typeorm";

import { dataSource } from "./src/config/data-source.config";
import { redisClient } from "./src/config/redis-cache.config";
import User from "./src/entity/User";
import { crypto, redis } from "./src/utils";

beforeAll(async () => {
  await dataSource.initialize();
  await redisClient.connect();
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userRepository: Repository<User> = dataSource.getRepository(User);
  const firstUser: User = new User();
  firstUser.role = "admin";
  firstUser.username = "test001";
  firstUser.email = "palodu@tutuapp.bid";
  const hashPassword1: string = await crypto.encryptPassword("123qwe!@#QWE");
  firstUser.password = hashPassword1;
  firstUser.fullName = "tester one";
  firstUser.isVerified = true;

  const secondUser: User = new User();
  secondUser.role = "user";
  secondUser.username = "test002";
  secondUser.email = "pineve@finews.biz";
  const hashPassword2: string = await crypto.encryptPassword("123qwe!@#QWE");
  secondUser.password = hashPassword2;
  secondUser.fullName = "tester two";

  const thirdUser: User = new User();
  thirdUser.role = "user";
  thirdUser.username = "test010";
  thirdUser.email = "pineve@finews.biz3";
  const hashPassword3: string = await crypto.encryptPassword("123qwe!@#QWE");
  thirdUser.password = hashPassword3;
  const verifyToken: string = "123456789abcdefabc";
  await redis.setCache(verifyToken, "test010", 120);
  thirdUser.fullName = "tester ten";
  userRepository.save([firstUser, secondUser, thirdUser]);

  const fakeVerifyToken: string = "123456789abcdefabb";
  await redis.setCache(fakeVerifyToken, "test011", 120);
});

afterAll(async () => {
  await dataSource.destroy();
  await redisClient.quit();
});
