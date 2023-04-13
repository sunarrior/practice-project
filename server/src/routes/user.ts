import { Router } from "express";

import { isAdmin } from "../middleware/is-admin";
import userAdmin from "./user.admin";
import user from "../controllers/user.controller";

const router: Router = Router();

router.use("/admin", isAdmin, userAdmin);
router.get("/", user.getUserProfile);
router.put("/", user.updateUserProfile);

export default router;
