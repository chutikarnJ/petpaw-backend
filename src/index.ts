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
import { adminRoute } from "./routes/admin.route";

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const requestOrigin = request.headers.get("origin");

        const allowedOrigins = [
          "http://localhost:5173", 
          "http://localhost:5174", 
          "https://petpaw-frontend-gwno456r3-chutikarns-projects.vercel.app/",
          "https://petpaw-frontend.vercel.app"
        ];
        return !!(requestOrigin && allowedOrigins.includes(requestOrigin));
      },
      credentials: true, 
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
      },
    })
  )
  .use(authRoute)
  .use(adminRoute)
  .use(userRoute)
  .use(productRoute)
  .use(cartRoute)
  .use(orderRoute)
  .use(
    staticPlugin({
      prefix: "/public/uploads",
      assets: "./public/uploads",
    })
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
