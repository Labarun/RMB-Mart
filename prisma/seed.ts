import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@rmbmart.com" },
    update: {},
    create: {
      name: "RMBmart Admin",
      email: "admin@rmbmart.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create a test customer
  const customerPassword = await hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      name: "Test Customer",
      email: "customer@test.com",
      phone: "0241234567",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log("✅ Test customer created:", customer.email);

  // Set initial exchange rate
  const existingRate = await prisma.exchangeRate.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!existingRate) {
    await prisma.exchangeRate.create({
      data: {
        rateGhsToRmb: 1.95,
        updatedBy: admin.id,
      },
    });
    console.log("✅ Default exchange rate set: 1 RMB = 1.95 GHS");
  } else {
    console.log("ℹ️  Exchange rate already exists, skipping.");
  }

  // Set initial payment settings
  const existingSettings = await prisma.paymentSettings.findFirst();

  if (!existingSettings) {
    await prisma.paymentSettings.create({
      data: {
        momoName: "RMBmart Official",
        momoNumber: "0240000000",
        momoNetwork: "MTN",
        instructions: "Please use your Order ID as the payment reference.",
        updatedBy: admin.id,
      },
    });
    console.log("✅ Default payment settings set");
  } else {
    console.log("ℹ️  Payment settings already exist, skipping.");
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Test Credentials:");
  console.log("  Admin: admin@rmbmart.com / admin123");
  console.log("  Customer: customer@test.com / customer123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
