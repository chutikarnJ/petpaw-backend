import { PrismaClient } from "../../generated/prisma";
import { UserInterface } from "../interfaces/user.interface";

const prisma = new PrismaClient();

const getAdminIdByToken = async (request: any, jwt: any) => {
  const auth = request.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  const payload = await jwt.verify(token);

  return payload.id;
};

export const UserController = {
  createUser: async ({ body }: { body: UserInterface }) => {
    try {
      const user = await prisma.user.create({
       data: body
      });
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  signin: async ({
    body,
    jwt,
  }: {
    body: { username: string; password: string };
    jwt: any;
  }) => {
    try {
      const admin = await prisma.user.findUnique({
        where: {
          username: body.username,
          password: body.password,
          status: "active",
        },
        select: {
          name: true,
          id: true,
        },
      });

      if (!admin) {
        return new Response("User not found", { status: 401 });
      }

      const token = await jwt.sign(admin);
      return { token: token };
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  info: async ({
    request,
    jwt,
  }: {
    request: {
      headers: Headers;
    };
    jwt: any;
  }) => {
    try {
      const adminId = await getAdminIdByToken(request, jwt);

      const admin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
        select: {
          name: true,
          level: true,
          username: true,
        },
      });

      return admin;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  update: async ({
    jwt,
    body,
    request,
  }: {
    jwt: any;
    body: AdminInterface;
    request: any;
  }) => {
    try {
      const adminId = await getAdminIdByToken(request, jwt);
      const oldAdmin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
      });
      const update = await prisma.admin.update({
        data: {
          name: body.name,
          username: body.username,
          password: body.password ?? oldAdmin?.password,
        },
        where: {
          id: adminId,
        },
      });

      return { message: "success" };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  updateData: async ({
    params,
    body,
  }: {
    body: AdminInterface;
    params: {
      id: string;
    };
  }) => {
    try {
      const user = await prisma.admin.findUnique({
        where: {
          id: params.id,
        },
      });
      await prisma.admin.update({
        data: {
          name: body.name,
          username: body.username,
          password: body.password ?? user?.password,
          level: body.level,
        },
        where: {
          id: params.id,
        },
      });

      return { message: "success" };
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  list: async () => {
    try {
      const admin = await prisma.admin.findMany({
        select: {
          id: true,
          name: true,
          level: true,
          username: true,
        },
        orderBy: {
          name: "asc",
        },
        where: {
          status: "active",
        },
      });

      return admin;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  delete: async ({ params }: { params: { id: string } }) => {
    try {
      await prisma.admin.update({
        data: { status: "inactive" },
        where: { id: params.id },
      });
      return { message: "success" };
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
