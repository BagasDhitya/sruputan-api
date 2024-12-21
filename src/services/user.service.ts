import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async updateUser(id: number, data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  generateToken(userId: number, email: string) {
    const payload = { id: userId, email };
    const secretKey = process.env.JWT_SECRET as string;
    const options = { expiresIn: "30d" };

    return jwt.sign(payload, secretKey, options);
  }

  verifyToken(token: string) {
    const secretKey = process.env.JWT_SECRET as string;
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
