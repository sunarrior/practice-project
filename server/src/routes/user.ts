import { Router } from "express";

import user from "../controllers/user.controller";

const router: Router = Router();

router.get("/all", user.getAllUsers);
router.get("/:username", user.getUserProfile);
router.post("/:username", user.updateUserProfile);
router.post("/:username/avatar", user.uploadImageProfile);
router.delete("/:id", user.deleteUser);

export default router;
