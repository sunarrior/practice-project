import { Repository } from "typeorm";

import { dataSource } from "./src/config/data-source.config";
import { redisClient } from "./src/config/redis-cache.config";
import User from "./src/entity/User";
import { crypto } from "./src/utils";

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
  userRepository.save([firstUser, secondUser]);
});

afterAll(async () => {
  await dataSource.destroy();
  await redisClient.quit();
});
