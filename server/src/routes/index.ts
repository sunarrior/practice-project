import express from "express";
import auth from "./auth";
import user from "./user";

import { validation } from "../middleware/input-validation";
import { tokenValidation } from "../middleware/token-validation";

const router = express.Router();

router.use("/auth", validation, auth);
router.use("/user", tokenValidation, user);

export default router;
