import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();
const orderController = new OrderController();

router.post("/", authenticate, orderController.createOrder);
router.get(
  "/top-sales",
  authenticate,
  authorizeAdmin,
  orderController.getMonthlyTopSales.bind(orderController)
);
router.get(
  "/:orderId",
  authenticate,
  orderController.getOrderById.bind(orderController)
);

export default router;
