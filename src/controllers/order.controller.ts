import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { AuthRequest } from "../types";

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: AuthRequest | any, res: Response) {
    try {
      const userId = req.user?.id;
      const { cartId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await orderService.createOrder(userId, cartId);
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: "Error creating order" });
    }
  }

  async getOrderById(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
      }

      const order = await orderService.getOrderById(parseInt(orderId));
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: "Order not found" });
    }
  }

  async getMonthlyTopSales(req: Request, res: Response) {
    try {
      const { year, month } = req.query;
      const topSales = await orderService.getMonthlyTopSales(
        parseInt(year as string),
        parseInt(month as string)
      );
      res.json(topSales);
    } catch (error) {
      res.status(404).json({ message: "Error fetching top sales" });
    }
  }
}
