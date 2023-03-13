import "reflect-metadata";
import EnvConfig from "./config/env.config";
import { dataSource } from "./config/data-source.config";
import app from "./app";

const PORT = EnvConfig.PORT || 4000;

dataSource
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(error));
