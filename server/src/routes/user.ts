import { Router } from "express";

import user from "../controllers/user.controller";

const router: Router = Router();

router.get("/all", user.getAllUsers);
router.get("/", user.getUserProfile);
router.post("/", user.updateUserProfile);
router.post("/avatar", user.uploadImageProfile);

export default router;
