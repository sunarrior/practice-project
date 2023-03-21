import { Router } from "express";
import auth from "./auth";
import user from "./user";
import order from "./order";
import category from "./category";

import { validation } from "../middleware/input-validation";
import { tokenValidation } from "../middleware/token-validation";

const router = Router();

router.use("/auth", validation, auth);
router.use("/user", tokenValidation, user);
router.use("/order", tokenValidation, order);
router.use("/category", category);

export default router;
