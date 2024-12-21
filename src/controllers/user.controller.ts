import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../types";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    const { email, password, name, address, phone } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name are required" });
    }

    try {
      const newUser = await userService.createUser({
        email,
        password,
        name,
        role: "USER",
        address,
        phone,
        token: null,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  }

  async updateProfile(req: AuthRequest | any, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const updatedUser = await userService.updateUser(userId, req.body);
      res.json(updatedUser);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching profile", error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      const { user, token } = await userService.login(email, password);

      res.json({ message: "Login successful", user, token });
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        return res.status(404).json({ message: "Invalid email or password" });
      }
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  }
}
