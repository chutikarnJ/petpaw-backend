import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser, SignupSchema } from "../interfaces/user.interface";

const prisma = new PrismaClient();

export const userService = {
  getUserById: async ({ id }: { id: string }) => {
    const userInfo = await prisma.user.findUnique({
      where: { id, status: "ACTIVE" },
      select: { id: true, email: true, username: true, role: true },
    });
    if (!userInfo) return new Response("User not found", { status: 400 });
    return userInfo;
  },
  deleteUser: async ({ id }: { id: string }) => {
    await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    return new Response("Deleted successfull", { status: 200 });
  },
};
