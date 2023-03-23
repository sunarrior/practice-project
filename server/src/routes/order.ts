import { Router } from "express";

import order from "../controllers/order.controller";

const router: Router = Router();

router.get("/", order.getOrderList);
router.get("/:id", order.getOrderItems);

export default router;