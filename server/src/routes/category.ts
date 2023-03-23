import { Router } from "express";

import category from "../controllers/category.controller";

const router: Router = Router();

router.get("/", category.getAllCategories);
router.get("/:id", category.getCategoryById);

export default router;
