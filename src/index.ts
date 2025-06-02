import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"; //bun add @elysiajs/cors
import { authRoute } from "./routes/auth.route";
import { jwt } from "@elysiajs/jwt"; //bun add @elysiajs/jwt
import { cookie } from "@elysiajs/cookie";
import { userRoute } from "./routes/user.route";
import { productRoute } from "./routes/product.route";
import { cartRoute } from "./routes/cart.route";
import staticPlugin from "@elysiajs/static";
import { orderRoute } from "./routes/order.route";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  )
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
      exp: "7d",
      cookie: {
        name: "access_token",
      }
    })
  )
  .use(authRoute)
  .use(userRoute)
  .use(productRoute)
  .use(cartRoute)
  .use(orderRoute)
  .use(
    staticPlugin({
      prefix: '/public/uploads',
      assets: './public/uploads',
    })
  )
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
