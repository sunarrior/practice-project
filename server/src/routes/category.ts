import { Router } from "express";

import { tokenValidation } from "../middleware/token-validation";
import category from "../controllers/category.controller";

const router: Router = Router();

router.get("/", category.getAllCategories);
router.get("/:id", category.getCategoryById);
router.post("/", tokenValidation, category.addNewCategory);
router.put("/", tokenValidation, category.updateCategory);

export default router;
