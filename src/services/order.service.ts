import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class OrderService {
  async createOrder(userId: number, cartId: number) {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) throw new Error("Cart not found");

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cartId },
    });

    await prisma.cart.delete({
      where: { id: cartId },
    });

    return order;
  }

  async getOrderById(orderId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    return order;
  }

  async getMonthlyTopSales(year: number, month: number) {
    return prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          createdAt: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
          status: "COMPLETED",
        },
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
    });
  }
}
