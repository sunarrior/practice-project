import { Router } from "express";

import cart from "../controllers/cart.controller";

const router: Router = Router();

router.get("/state", cart.getCartState);
router.post("/", cart.addCartItem);

export default router;
