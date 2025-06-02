import { t } from "elysia";

export const signupSchema = t.Object({
  username: t.String(),
  email: t.String(),
  password: t.String(),
});

export const authenUser = t.Object({
  id: t.String(),
  username: t.String(),
  role: t.Union([t.Literal('USER'), t.Literal('ADMIN')]),
})


export type SignupSchema = typeof signupSchema.static;
export type AuthenticatedUser = typeof authenUser.static;