import { Elysia } from "elysia";
import { adminService } from "../services/admin.service";
import { orderService } from "../services/order.service";
import { signupSchema } from "../interfaces/user.interface";

export const adminRoute = new Elysia().group("/admin", (app) =>
  app
    .post(
      "/signup",
      async ({ body }) => {
        try {
          const result = await adminService.signupAdmin(body);
          return result;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
      {
        body: signupSchema,
      }
    )
    .get("/dashboard", async () => {
        try {
            const result = await adminService.getDashboardData();
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    })
    .get("/user", async () => {
      try {
        const result = await adminService.getAllUser();
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .get("/order", async ({ query }: any) => {
      try {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await adminService.getAllOrders({ query, skip, limit });
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
);
