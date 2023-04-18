import { Router } from "express";

import webhook from "../controllers/webhook.controller";

const router: Router = Router();

router.post("/", webhook.webhookStripe);

export default router;
