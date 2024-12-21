import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CartService {
  async addToCart(userId: number, productId: number, quantity: number) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  async getCart(userId: number) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateItemQuantity(
    userId: number,
    productId: number,
    quantity: number
  ) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!existingItem) {
      throw new Error("Product not found in cart");
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
      return { message: "Item removed from cart" };
    }

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity },
    });
  }

  async removeItemQuantity(
    userId: number,
    productId: number,
    quantity: number
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity to remove must be greater than zero");
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!existingItem) {
      throw new Error("Product not found in cart");
    }

    if (existingItem.quantity <= quantity) {
      await prisma.cartItem.delete({
        where: { id: existingItem.id },
      });
      return { message: "Item completely removed from cart" };
    }

    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity - quantity },
    });
  }
}
