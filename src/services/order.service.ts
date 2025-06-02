import { OrderStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const orderService = {
  getOrderByUserId: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        OrderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!orders) {
      return new Response("Order not found", { status: 404 });
    }
    return orders;
  },
  createOrder: async (userId: string) => {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return new Response("Cart is empty", { status: 400 });
    }

    const total_price = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    //create order and order items
    const order = await prisma.order.create({
      data: {
        userId: userId,
        total_price: total_price,
        OrderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price * item.quantity,
          })),
        },
      },
      include: {
        OrderItems: true,
      },
    });

    // update product stock
    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    // delete cart items
    await prisma.cartItem.deleteMany({
      where: { userId: userId },
    });

    return order;
  },
  getOrderDetails: async (orderId: string) => {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      return new Response("Order not found", { status: 404 });
    }
    return order;
  },
};
