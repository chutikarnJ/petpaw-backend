import Elysia, { t } from "elysia";
import { productService } from "../services/product.service";

export const queryCustom = t.Object({
  page: t.Optional(t.Number()),
  limit: t.Optional(t.Number()),
  category: t.Optional(t.Array(t.String())),
  petTypes: t.Optional(t.Array(t.String())),
  maxPrice: t.Optional(t.Number()),
  minPrice: t.Optional(t.Number()),
  search: t.Optional(t.String()),
});

export const productRoute = new Elysia().group("/product", (app) =>
  app
    .get(
      "/",
      async ({ query }) => {
        try {
          const result = await productService.getAllProducts(query);
          return result;
        } catch (error) {
          console.log(error);
          return error;
        }
      },
      {
        query: queryCustom,
      }
    )
    .get("/:id", async ({ params }) => {
      try {
        const result = await productService.getProductById(params.id);
        return result;
      } catch (error) {}
    })
    .post("/create", async ({ body }) => {
      try {
        await productService.createProduct(body);
        return { message: "Product created" };
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .put("/update/:id", async ({ params, body }) => {
      try {
        await productService.updateProduct(params.id, body);
        return { message: `Product with ID ${params.id} updated` };
      } catch (error) {
        console.log(error);
        return error;
      }
    })
    .delete("/delete/:id", async ({ params }) => {
      try {
        await productService.deleteProduct(params.id);
        return { message: `Product with ID ${params.id} deleted` };
      } catch (error) {
        console.log(error);
        return error;
      }
    })
);
