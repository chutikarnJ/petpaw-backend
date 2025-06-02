import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser, SignupSchema } from "../interfaces/user.interface";
import { StringDecoder } from "node:string_decoder";

const prisma = new PrismaClient();

export const cartService = {
  addToCart: async (userId: string, productId: string, quantity: number) => {
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      return await prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
    }
  },
  updateCart: async (cartId: string, quantity: number) => {
    await prisma.cartItem.update({
      where: { id: cartId },
      data: { quantity: quantity },
    })
  return new Response("Updated successfull", { status: 200 });
  },
  getAllCart: async (userId: string) => {
    const carts = await prisma.cartItem.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
      },
    });
    return carts;
  },
  deleteCart: async (cartId: string) => {
    await prisma.cartItem.delete({
      where: { id: cartId },
    });
    return new Response("Deleted successfull", { status: 200 });
  },
};
