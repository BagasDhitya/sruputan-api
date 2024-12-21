import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const cartController = new CartController();

router.post(
  "/add",
  authenticate,
  cartController.addToCart.bind(cartController)
);

router.get("/", authenticate, cartController.getCart.bind(cartController));

router.patch(
  "/update",
  authenticate,
  cartController.updateItemQuantity.bind(cartController)
);

router.patch(
  "/remove",
  authenticate,
  cartController.removeItemQuantity.bind(cartController)
);

export default router;
