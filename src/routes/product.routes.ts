import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();

router.get("/", authenticate, productController.getAllProducts);
router.post(
  "/discount",
  authenticate,
  authorizeAdmin,
  productController.createDiscount.bind(productController)
);

export default router;
