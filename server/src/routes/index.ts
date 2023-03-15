import express from "express";
import auth from "./auth";

import { validation } from "../middleware/input-validation";

const router = express.Router();

router.use("/auth", validation, auth);

export default router;
