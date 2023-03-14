import { Router } from "express";
import auth from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", auth.createUser);
router.post("/verify", auth.verifyUser);
router.post("/login", auth.loginUser);

export default router;
