import { Elysia } from "elysia";
import { authService } from "../services/auth.service";
import { signupSchema } from "../interfaces/user.interface";

export const authRoute = new Elysia().group("/auth", (app) =>
  app
    .post(
      "/signup",
      async ({ body }) => {
        try {
          const result = await authService.signupUser(body);
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
    .post(
      "/admin",
      async ({ body }) => {
        try {
          const result = await authService.signupAdmin(body);
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
    .post(
      "/signin",
      async ({
        body,
        jwt,
        cookie,
      }: {
        body: { email: string; password: string };
        jwt: any;
        cookie: any;
      }) => {
        try {
          const result = await authService.signinUser({ body });
          const token = await jwt.sign({
            id: result.id,
            role: result.role,
            username: result.username,
          });
          cookie.access_token.set({
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "None",
            secure: true,
          });

          return {
            message: "Login Successfully",
            // token: cookie.access_token,
          };
        } catch (error) {
          console.log(error);
          return error;
        }
      }
    )
    .post("/logout", async ({ cookie }) => {
      cookie.access_token.remove();
      return { message: "Logged out" };
    })
);
