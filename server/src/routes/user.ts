import { Router } from "express";

import { isAdmin } from "../middleware/is-admin";
import userAdmin from "./user.admin";
import userPayment from "./user.payment";
import user from "../controllers/user.controller";

const router: Router = Router();

router.use("/admin", isAdmin, userAdmin);
router.use("/payment", userPayment);
router.get("/", user.getUserProfile);
router.put("/", user.updateUserProfile);

export default router;
