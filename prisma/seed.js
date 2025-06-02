import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: "admin@petpaw.com",
      username: "admin-petpaw",
      password: "admin1234",
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "user@petpaw.com",
      username: "user-petpaw",
      password: "user1234",
      role: "USER",
    },
  });

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Organic Dog Food",
        description: "Healthy and delicious dog food.",
        price: 599.0,
        stock: 100,
        petType: "DOG",
        category: "Food",
        imageUrl: "https://place-puppy.com/300x300",
      },
      {
        name: "Cat Tower Tree",
        description: "Multi-level climbing tower for cats.",
        price: 344.0,
        stock: 50,
        petType: "CAT",
        category: "Furniture",
        imageUrl: "https://place-puppy.com/300x300",
      },
      {
        name: "Grooming Brush",
        description: "Keep your pet clean and healthy.",
        price: 159.0,
        stock: 75,
        petType: "ALL",
        category: "Grooming",
        imageUrl: "https://place-puppy.com/300x300",
      },
    ],
  });

  console.log("✅ Users and Products created.");

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
