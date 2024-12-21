import { Response } from "express";
import { CartService } from "../services/cart.service";
import { AuthRequest } from "../types";

const cartService = new CartService();

export class CartController {
  async addToCart(req: AuthRequest | any, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cartItem = await cartService.addToCart(userId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Error adding to cart" });
    }
  }

  async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cart = await cartService.getCart(userId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  }

  async updateItemQuantity(req: AuthRequest | any, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity must be greater than 0" });
      }

      const updatedItem = await cartService.updateItemQuantity(
        userId,
        productId,
        quantity
      );
      res.json(updatedItem);
    } catch (error) {
      if (error.message === "Product not found in cart") {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      res.status(500).json({ message: "Error updating cart item" });
    }
  }

  async removeItemQuantity(req: AuthRequest | any, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Quantity to remove must be greater than 0" });
      }

      const updatedItem = await cartService.removeItemQuantity(
        userId,
        productId,
        quantity
      );
      res.json(updatedItem);
    } catch (error) {
      if (error.message === "Product not found in cart") {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      res.status(500).json({ message: "Error removing item from cart" });
    }
  }
}
