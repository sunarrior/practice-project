import { Router } from "express";

import category from "../controllers/category.controller";

const router = Router();

router.get("/", category.getAllCategories);
router.get("/:id", category.getCategory);

export default router;
