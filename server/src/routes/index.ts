import express from "express";
import auth from "./auth";
import user from "./user";

import { validation } from "../middleware/input-validation";

const router = express.Router();

router.use("/auth", validation, auth);
router.use("/user", user);

export default router;
