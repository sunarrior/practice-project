import { Router } from "express";

import product from "../controllers/product.controller";

const router: Router = Router();

router.post("/", product.addProduct);
router.get("/", product.getAllProducts);
router.get("/:categoryid/category", product.getProductByCategory);
router.get("/:id", product.getProductDetail);
router.put("/", product.updateProductDetail);
router.delete("/", product.remmoveProducts);

export default router;
