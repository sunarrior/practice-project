import { Router } from "express";

import user from "../controllers/user.controller";

const router: Router = Router();

router.get("/all", user.getAllUsers);
router.get("/", user.getUserProfile);
router.get("/:username", user.getUserProfile);
router.put("/", user.updateUserProfile);
router.put("/:username", user.updateUserProfile);
router.post("/avatar", user.uploadImageProfile);
router.post("/:username/avatar", user.uploadImageProfile);
router.delete("/:id", user.deleteUser);

export default router;
