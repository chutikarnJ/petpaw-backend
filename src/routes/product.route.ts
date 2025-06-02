import Elysia from "elysia";
import { productService } from "../services/product.service";
import { productSchema } from "../interfaces/product.interface";

export const productRoute = new Elysia().group("/product", (app) =>
  app
    .get("/", async ({query}) => {
      try {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await productService.getAllProducts({skip, limit});
        return result;
      } catch (error) {
        console.log(error);
        return error;
      }
    })
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
