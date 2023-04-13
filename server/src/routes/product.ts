import { Router } from "express";

import { jwtValidation } from "../middleware/jwt-validation";
import { isAdmin } from "../middleware/is-admin";
import product from "../controllers/product.controller";

const router: Router = Router();

router.get("/", product.getAllProducts);
router.get("/:id", product.getProductDetail);
router.post("/", [jwtValidation, isAdmin], product.addProduct);
router.put("/:id", [jwtValidation, isAdmin], product.updateProductDetail);
router.delete("/", [jwtValidation, isAdmin], product.remmoveProducts);

export default router;
