import { Router } from "express";

import order from "../controllers/order.controller";
import { isAdmin } from "../middleware/is-admin";

const router: Router = Router();

router.get("/all", isAdmin, order.getAllOrders);
router.get("/", order.getOrderListByUserId);
router.get("/:id", order.getOrderItems);
router.post("/checkout", order.createCheckoutSession);
router.post("/payment", order.createPaymentIntent);
router.post("/", order.createOrder);
router.put("/", isAdmin, order.updateOrders);
router.delete("/", isAdmin, order.cancelOrders);

export default router;
