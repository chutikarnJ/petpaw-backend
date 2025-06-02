import { PrismaClient } from "@prisma/client";
import { ProductSchema } from "../interfaces/product.interface";
import fs from "fs/promises";

const prisma = new PrismaClient();

export const productService = {
  getAllProducts: async ({ skip, limit }: any) => {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count(),
    ]);
    return {
      data: products,
      count: total,
      totalPages: Math.ceil(total / limit),
    };
  },

  getProductById: async (id: string) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) return new Response("Product not found", { status: 404 });
    return product;
  },

  createProduct: async (payload: any) => {
    const imageName = payload.imageUrl?.name;
    const imageUrl = payload.imageUrl;

    const parsedPetTypes =
      typeof payload.petTypes === "string"
        ? JSON.parse(payload.petTypes)
        : payload.petTypes ?? [];

    const newProduct = await prisma.product.create({
      data: {
        ...payload,
        price: parseFloat(payload.price),
        stock: parseInt(payload.stock),
        description: payload.description || "",
        category: payload.category,
        imageUrl: imageName,
        petTypes: parsedPetTypes,
      },
    });

    if (imageUrl) {
      Bun.write(`./public/uploads/` + imageName, imageUrl);
    }

    return newProduct;
  },

  updateProduct: async (id: string, payload: any) => {
    const imageName = payload.imageUrl?.name;
    const imageUrl = payload.imageUrl;

    const parsedPetTypes = payload.petTypes ? JSON.parse(payload.petTypes) : [];

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      return new Response("Product not found", { status: 404 });
    }

    if (imageName != "" && imageName != undefined) {
      const oldImagePath = `./public/uploads/${existingProduct.imageUrl}`;
      try {
        await fs.unlink(oldImagePath);
      } catch {
        console.log("Old image not found");
      }
      Bun.write(`./public/uploads/` + imageName, imageUrl);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: payload.name || existingProduct.name,
        price: payload.price
          ? parseFloat(payload.price)
          : existingProduct.price,
        description: payload.description || existingProduct.description,
        stock: payload.stock ? parseInt(payload.stock) : existingProduct.stock,
        category: payload.category || existingProduct.category,
        imageUrl: imageName || existingProduct.imageUrl,
        brand: payload.brand || existingProduct.brand,
        petTypes:
          parsedPetTypes.length > 0 ? parsedPetTypes : existingProduct.petTypes,
      },
    });
    return updatedProduct;
  },

  deleteProduct: async (id: string) => {
    await prisma.product.delete({
      where: { id },
    });
    return new Response("Deleted successfully", { status: 200 });
  },
};
