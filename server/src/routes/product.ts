import { Router } from "express";

import product from "../controllers/product.controller";

const router: Router = Router();

router.get("/", product.getAllProducts);
router.get("/:categoryid/category", product.getProductByCategory);
router.get("/:id", product.getProductDetail);

export default router;
