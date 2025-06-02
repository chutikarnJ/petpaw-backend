import { Elysia } from "elysia";
import { orderService } from "../services/order.service";
import { authMiddleware } from "../middleware/auth.middleware";

export const orderRoute = new Elysia().group("/order", (app) =>
  app
    .use(authMiddleware())
    .get("/", async ({ user }: any) => {
      try {
        const result = await orderService.getOrderByUserId(user.id);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .post("/create", async ({ user }: any) => {
      try {
        const result = await orderService.createOrder(user.id);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .get("/:orderId", async ({ params }: any) => {
      try {
        const { orderId } = params;
        const result = await orderService.getOrderDetails(orderId);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    
);
