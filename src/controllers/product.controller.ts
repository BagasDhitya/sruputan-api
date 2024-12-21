import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  }

  async createDiscount(req: Request, res: Response) {
    try {
      const { productId, percent, startDate, endDate } = req.body;
      const discount = await productService.createDiscount(
        productId,
        percent,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(discount);
    } catch (error) {
      res.status(500).json({ message: 'Error creating discount' });
    }
  }
}