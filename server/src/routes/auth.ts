import { Router } from "express";
import auth from "../controllers/auth.controller";

import { registerValidation } from "../middleware/register-validation";
import { tokenValidation } from "../middleware/token-validation";
import { loginValidation } from "../middleware/login-validation";
import { recoveryValidation } from "../middleware/recovery-validation";
import { jwtValidation } from "../middleware/jwt-validation";

const router: Router = Router();

router.post("/register", registerValidation, auth.createUser);
router.post("/verify", tokenValidation, auth.verifyUser);
router.post("/login", loginValidation, auth.loginUser);
router.get("/session", jwtValidation, auth.sessionAuthentication);
router.post("/recovery", recoveryValidation, auth.changePassword);
router.get("/logout", jwtValidation, auth.logoutUser);

export default router;
