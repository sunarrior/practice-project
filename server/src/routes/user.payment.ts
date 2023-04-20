import { Router } from "express";

import user from "../controllers/user.controller";

const router: Router = Router();

router.get("/", user.getAllPaymentMethods);
router.post("/", user.addCardPayment);

export default router;
