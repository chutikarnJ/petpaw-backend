import { PrismaClient } from "@prisma/client";
import { AuthenticatedUser, SignupSchema } from "../interfaces/user.interface";

const prisma = new PrismaClient();

export const adminService = {
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
  getAllUser: async () => {
    const users = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, email: true, username: true, role: true },
    });
    return users;
  },
  getAllOrders: async ({ query, skip, limit }: any) => {
    // const whereClause: any = {};
    // if (query.search) {
    //   whereClause.OR = [
    //     {
    //       id: {
    //         contains: query.search as string,
    //       },
    //     },
    //     {
    //       user: {
    //         username: {
    //           contains: query.search as string,
    //           mode: "insensitive",
    //         },
    //       },
    //     },
    //     {
    //       OrderItems: {
    //         some: {
    //           product: {
    //             name: {
    //               contains: search as string,
    //               mode: "insensitive",
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ];
    // }
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        // where: whereClause,
        include: {
          user: true,
          OrderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    return {
      data: orders,
      count: total,
      totalPages: Math.ceil(total / limit),
    };
  },
  getDashboardData: async () => {
    //count orders, total revenue, users, products
    const [ordersCount, totalRevenue, usersCount, productsCount] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: {
            total_price: true,
          },
        }),
        prisma.user.count({
          where: { role: "USER", status: "ACTIVE" },
        }),
        prisma.product.count(),
      ]);

    //status order chart
    const orderGroup = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    //group by month chart
    const resultMonth = await prisma.$queryRaw<
      Array<{ month: string; order_count: number; total_revenue: number }>
    >`
    SELECT
      TO_CHAR("createdAt", 'YYYY-MM') AS month,
      COUNT(*) AS order_count,
      SUM("total_price") AS total_revenue
    FROM "Order"
    GROUP BY month
    ORDER BY month ASC
  `;

    const formattedMonth = resultMonth.map((row: any) => ({
      ...row,
      order_count: Number(row.order_count),
      total_revenue: Number(row.total_revenue),
    }));

    //top seller products
    const products = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    });

    const topProducts = await prisma.product.findMany({
      where: {
        id: { in: products.map((r) => r.productId) },
      },
      select: { id: true, name: true },
    });

    return {
      orders: ordersCount,
      revenue: totalRevenue._sum.total_price || 0,
      users: usersCount,
      products: productsCount,
      orderGroup: orderGroup.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      MonthRevenue: formattedMonth,
      topSellers: products.map((r) => {
        const product = topProducts.find((p) => p.id === r.productId);
        return {
          product_id: r.productId,
          product_name: product?.name || "Unknown",
          total_sold: r._sum.quantity || 0,
          total_revenue: r._sum.price || 0,
        };
      }),
    };
  },
};
