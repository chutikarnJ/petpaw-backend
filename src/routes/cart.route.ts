import { Elysia } from "elysia";
import { cartService } from "../services/cart.service";
import { authMiddleware } from "../middleware/auth.middleware";

export const cartRoute = new Elysia().group("/cart", (app) =>
  app
    .use(authMiddleware())
    .get("/", async ({ user }: any) => {
      try {
        const result = await cartService.getAllCart(user.id);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .post("/add", async ({ body, user }: any) => {
      try {
        const { productId, quantity } = body;
        const result = await cartService.addToCart(
          user.id,
          productId,
          quantity
        );
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .put("/:cartId", async ({ params, body }: any) => {
      try {
        const { cartId } = params;
        const { quantity } = body;
        const result = await cartService.updateCart(cartId, quantity);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .delete("/:cartId", async ({ params }: any) => {
      try {
        const { cartId } = params;
        const result = await cartService.deleteCart(cartId);
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
);
