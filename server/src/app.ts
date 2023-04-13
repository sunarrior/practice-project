import express, { Express } from "express";
import cors from "cors";

import router from "./routes/index";
import cartReminder from "./cronjobs/cart-reminder";

const app: Express = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// cartReminder.cartReminderCronJob().start();

app.use("/api/v1", router);

export default app;
