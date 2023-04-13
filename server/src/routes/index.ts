import { Router } from "express";
import auth from "./auth";
import user from "./user";
import order from "./order";
import category from "./category";
import product from "./product";
import cart from "./cart";

import { jwtValidation } from "../middleware/jwt-validation";

const router: Router = Router();

router.use("/auth", auth);
router.use("/user", jwtValidation, user);
router.use("/orders", jwtValidation, order);
router.use("/categories", category);
router.use("/products", product);
router.use("/cart", jwtValidation, cart);

export default router;
