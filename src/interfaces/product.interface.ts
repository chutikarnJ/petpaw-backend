import { t } from "elysia";

export const CategoryEnum = {
  FOOD: "FOOD",
  TOYS: "TOYS",
  GROOMING: "GROOMING",
  HEALTH: "HEALTH",
  ACCESSORIES: "ACCESSORIES",
} as const;

export const PetTypeEnum = {
  DOG: "DOG",
  CAT: "CAT",
  BIRD: "BIRD",
  RABBIT: "RABBIT",
  ALL: "ALL",
  OTHER: "OTHER",
} as const;

export const productSchema = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  price: t.Number(),
  stock: t.Number(),
  brand: t.Optional(t.String()),
  category: t.Optional(t.Enum(CategoryEnum)),
  imageUrl: t.Optional(t.File()),
  petTypes: t.Optional(t.Array(t.Enum(PetTypeEnum))),
});

export type ProductSchema = typeof productSchema.static;
