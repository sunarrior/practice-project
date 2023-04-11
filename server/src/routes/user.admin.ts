import { Router } from "express";

import user from "../controllers/user.controller";

const router: Router = Router();

router.get("/", user.getAllUsers);
router.get("/:id", user.getUserProfileAdmin);
router.put("/:id", user.updateUserProfileAdmin);
router.put("/:id/block", user.changeBlockStatus);
router.delete("/:id", user.deleteUser);

export default router;
