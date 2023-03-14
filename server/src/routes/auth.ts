import express from "express";
import auth from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", auth.createUser);
router.post("/verify", auth.verifyUser);

export default router;
