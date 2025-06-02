import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser, SignupSchema } from "../interfaces/user.interface";
import { password } from "bun";

const prisma = new PrismaClient();

export const adminService = {
  signupUser: async (body: SignupSchema) => {
    const existing = await prisma.user.findUnique({
      where: {
        email: body.email,
        status: "ACTIVE",
      },
    });

    if (existing) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
    });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
        role: "USER",
      },
      select: { id: true, email: true, username: true },
    });

    return user;
  },
  signupAdmin: async (body: SignupSchema) => {
    const existing = await prisma.user.findUnique({
      where: {
        email: body.email,
        status: "ACTIVE ",
      },
    });

    if (existing) {
      return new Response("Admin already exists", { status: 400 });
    }

    const hashedPassword = await Bun.password.hash(body.password, {
      algorithm: "bcrypt",
    });

    const admin = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
        role: "ADMIN",
      },
      select: { id: true, email: true, username: true },
    });

    return admin;
  },

  signinUser: async ({
    body,
  }: {
    body: { email: string; password: string };
  }): Promise<AuthenticatedUser> => {
    const user = await prisma.user.findUnique({
      where: { email: body.email, status: "ACTIVE" },
    });

    if (!user) {
      throw new Response("Invalid email or password", { status: 400 });
    }

    const validPassword = await Bun.password.verify(
      body.password,
      user.password
    );
    if (!validPassword) {
      throw new Response("Invalid email or passeword", { status: 400 });
    }

    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  },
};
