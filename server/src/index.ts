import "reflect-metadata";
import EnvConfig from "./config/env.config";
import { dataSource } from "./config/data-source.config";
import { redisClient } from "./config/redis-cache";
import app from "./app";

const PORT = EnvConfig.PORT || 4000;

(async () => {
  try {
    await dataSource.initialize();
    await redisClient.connect();
    app.listen(PORT, () => {
      console.log(`listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
