import { Router } from "express";
import auth from "../controllers/auth.controller";

import { tokenValidation } from "../middleware/token-validation";

const router: Router = Router();

router.post("/register", auth.createUser);
router.post("/verify", auth.verifyUser);
router.post("/login", auth.loginUser);
router.get("/session", tokenValidation, auth.sessionAuthentication);
router.post("/recovery", auth.changePassword);
router.get("/logout", tokenValidation, auth.logoutUser);

export default router;
