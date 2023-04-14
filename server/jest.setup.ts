import { dataSource } from "./src/config/data-source.config";
import { redisClient } from "./src/config/redis-cache.config";
import User from "./src/entity/User";
import { crypto } from "./src/utils";

beforeAll(async () => {
  await dataSource.initialize();
  await redisClient.connect();
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const userRepository = dataSource.getRepository(User);
  const firstUser: User = new User();
  firstUser.role = "admin";
  firstUser.username = "hahaha01";
  firstUser.email = "palodu@tutuapp.bid";
  const hashPassword: string = await crypto.encryptPassword("123qwe!@#QWE");
  firstUser.password = hashPassword;
  firstUser.fullName = "haha";
  userRepository.save(firstUser);
});

afterAll(async () => {
  await dataSource.destroy();
  await redisClient.quit();
});
