import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get(
  "/profile",
  authenticate,
  userController.getProfile.bind(userController)
);

router.put(
  "/profile",
  authenticate,
  userController.updateProfile.bind(userController)
);

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));

export default router;
