import { Router } from "express";

import cart from "../controllers/cart.controller";

const router: Router = Router();

router.get("/", cart.getAllCartItems);
router.post("/", cart.addCartItem);
router.delete("/", cart.removeItems);

export default router;
