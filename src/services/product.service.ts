import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.product.create({
      data
    });
  }

  async getAllProducts() {
    return prisma.product.findMany({
      include: {
        discounts: {
          where: {
            endDate: {
              gte: new Date()
            }
          }
        }
      }
    });
  }

  async createDiscount(productId: number, percent: number, startDate: Date, endDate: Date) {
    return prisma.discount.create({
      data: {
        productId,
        percent,
        startDate,
        endDate
      }
    });
  }
}