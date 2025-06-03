import { Elysia } from "elysia";
import { jwt as JwtPlugin } from "@elysiajs/jwt";

export const authMiddleware = () =>
  new Elysia({ name: "authMiddleware" })
    .use(
      JwtPlugin({
        name: "jwt",
        secret: Bun.env.JWT_SECRET!,
        cookie: {
          name: "access_token",
        },
      })
    )

    .derive({ as: "scoped" }, async ({ jwt, cookie }) => {
      const token = cookie?.access_token?.value;
      

      if (!token) {
        throw new Response("Unauthorized: Missing token", { status: 401 });
      }

      const payload = await jwt.verify(token);
      if (!payload) {
        throw new Response("Unauthorized: Invalid token", { status: 401 });
      }

      return {
        user: payload,
      };
    });
