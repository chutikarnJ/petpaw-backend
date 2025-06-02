import { Elysia } from "elysia";
import { userService } from "../services/user.service";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRoute = new Elysia().group(
  "/user",
  (app) =>
    app
      .use(authMiddleware())
      .get("/profile", async ({ user }: any) => {
        return user;
      })
      .get("/profile/:id", async ({ user }: any) => {
        try {
          const result = await userService.getUserById(user.id);
          return result;
        } catch (error) {
          console.log(error);
          return error;
        }
      })
     

  // .put("/delete/:id", authController.deleteUser)
);
