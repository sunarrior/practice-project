import "reflect-metadata";
import EnvConfig from "./config/env.config";
import { dataSource } from "./config/data-source.config";
import { redisClient } from "./config/redis-cache.config";
import app from "./app";

const PORT: number = EnvConfig.PORT || 4000;

(async (): Promise<void> => {
  try {
    await dataSource.initialize();
    await redisClient.connect();
    app.listen(PORT, (): void => {
      console.log(`listening at http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.log(error);
  }
})();
