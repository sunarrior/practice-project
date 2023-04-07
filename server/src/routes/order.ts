import { Router } from "express";

import order from "../controllers/order.controller";
import { isAdmin } from "../middleware/is-admin";

const router: Router = Router();

router.get("/all", isAdmin, order.getAllOrders);
router.get("/", order.getOrderListByUserId);
router.get("/:id", order.getOrderItems);
router.post("/", order.createOrder);

export default router;
