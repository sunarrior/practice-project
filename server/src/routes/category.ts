import { Router } from "express";

import { jwtValidation } from "../middleware/jwt-validation";
import { isAdmin } from "../middleware/is-admin";
import category from "../controllers/category.controller";

const router: Router = Router();

router.get("/", category.getAllCategories);
router.get("/:id", category.getCategoryById);
router.get("/:id/products", category.getProductByCategory);
router.post("/", [jwtValidation, isAdmin], category.addNewCategory);
router.put("/:id", [jwtValidation, isAdmin], category.updateCategory);
router.delete("/", [jwtValidation, isAdmin], category.deleteCategory);

export default router;
