/**
 * SocietyBuy Seed Script
 * Generates fictional development data only.
 * Run with: npx ts-node prisma/seed.ts
 * Or: npx prisma db seed
 */

import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SocietyBuy seed...");

  // ─── Platform Admin ──────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin@1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@societybuy.in" },
    update: {},
    create: {
      email: "admin@societybuy.in",
      passwordHash: adminHash,
      role: UserRole.PLATFORM_ADMIN,
      status: UserStatus.ACTIVE,
      profile: {
        create: { firstName: "Platform", lastName: "Admin" },
      },
    },
  });
  console.log("✓ Admin user:", admin.email);

  // ─── Categories ──────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "grains-flour" },
      update: {},
      create: {
        name: "Grains & Flour",
        slug: "grains-flour",
        description: "Wheat, rice, flour, and cereals",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cooking-oil" },
      update: {},
      create: {
        name: "Cooking Oil",
        slug: "cooking-oil",
        description: "Sunflower, mustard, groundnut, and blended oils",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pulses-dals" },
      update: {},
      create: {
        name: "Pulses & Dals",
        slug: "pulses-dals",
        description: "Toor, moong, chana, masoor, and more",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "cleaning-care" },
      update: {},
      create: {
        name: "Cleaning & Care",
        slug: "cleaning-care",
        description: "Detergents, soaps, and household cleaners",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "dairy-eggs" },
      update: {},
      create: {
        name: "Dairy & Eggs",
        slug: "dairy-eggs",
        description: "Milk, paneer, butter, curd, and eggs",
        sortOrder: 5,
      },
    }),
  ]);
  console.log("✓ Categories created:", categories.length);

  // ─── Products ────────────────────────────────────────────────────────────
  const products = [
    {
      name: "Aashirvaad Whole Wheat Atta",
      slug: "aashirvaad-whole-wheat-atta",
      brand: "Aashirvaad",
      categorySlug: "grains-flour",
      description: "High-quality whole wheat atta made from 100% whole wheat grains. Perfect for soft, nutritious rotis.",
      imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
    },
    {
      name: "Fortune Sunflower Oil",
      slug: "fortune-sunflower-oil",
      brand: "Fortune",
      categorySlug: "cooking-oil",
      description: "Light and healthy sunflower oil, ideal for everyday cooking.",
      imageUrls: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"],
    },
    {
      name: "Tata Sampann Toor Dal",
      slug: "tata-sampann-toor-dal",
      brand: "Tata Sampann",
      categorySlug: "pulses-dals",
      description: "Premium toor dal, natural and unpolished, rich in protein.",
      imageUrls: ["https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=400"],
    },
    {
      name: "Surf Excel Easy Wash",
      slug: "surf-excel-easy-wash",
      brand: "Surf Excel",
      categorySlug: "cleaning-care",
      description: "Effective detergent powder for tough stain removal.",
      imageUrls: ["https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=400"],
    },
    {
      name: "Amul Full Cream Milk 1L",
      slug: "amul-full-cream-milk-1l",
      brand: "Amul",
      categorySlug: "dairy-eggs",
      description: "Fresh and nutritious full cream milk from Amul.",
      imageUrls: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400"],
    },
    {
      name: "India Gate Basmati Rice",
      slug: "india-gate-basmati-rice",
      brand: "India Gate",
      categorySlug: "grains-flour",
      description: "Long-grain basmati rice with authentic aroma.",
      imageUrls: ["https://images.unsplash.com/photo-1536304993881-ff86e0c9bfe4?w=400"],
    },
    {
      name: "Saffola Active Oil 5L",
      slug: "saffola-active-oil-5l",
      brand: "Saffola",
      categorySlug: "cooking-oil",
      description: "Blended oil with the goodness of rice bran and sunflower oil.",
      imageUrls: [],
    },
    {
      name: "Vim Dishwash Bar",
      slug: "vim-dishwash-bar",
      brand: "Vim",
      categorySlug: "cleaning-care",
      description: "Anti-bacterial dishwash bar for sparkling clean vessels.",
      imageUrls: [],
    },
  ];

  const createdProducts: Record<string, { id: string }> = {};
  for (const p of products) {
    const cat = categories.find((c) => c.slug === p.categorySlug);
    if (!cat) continue;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        categoryId: cat.id,
        description: p.description,
        imageUrls: p.imageUrls,
        status: "ACTIVE",
      },
    });
    createdProducts[p.slug] = product;
  }
  console.log("✓ Products created:", Object.keys(createdProducts).length);

  // ─── Societies ───────────────────────────────────────────────────────────
  const societies = await Promise.all([
    prisma.society.upsert({
      where: { slug: "sunrise-apartments-411001" },
      update: {},
      create: {
        name: "Sunrise Apartments",
        slug: "sunrise-apartments-411001",
        address: "Survey No. 45, Baner Road",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411045",
        totalFlats: 120,
        description: "Premium residential community in Baner",
      },
    }),
    prisma.society.upsert({
      where: { slug: "green-valley-residency-400076" },
      update: {},
      create: {
        name: "Green Valley Residency",
        slug: "green-valley-residency-400076",
        address: "Plot 12, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400058",
        totalFlats: 80,
        description: "Affordable housing in Andheri",
      },
    }),
  ]);
  console.log("✓ Societies created:", societies.length);

  // ─── Merchant ────────────────────────────────────────────────────────────
  const merchantHash = await bcrypt.hash("Merchant@1234", 12);
  const merchantUser = await prisma.user.upsert({
    where: { email: "merchant@greenfield.in" },
    update: {},
    create: {
      email: "merchant@greenfield.in",
      passwordHash: merchantHash,
      role: UserRole.MERCHANT,
      status: UserStatus.ACTIVE,
      profile: {
        create: { firstName: "Ramesh", lastName: "Patel" },
      },
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: {},
    create: {
      userId: merchantUser.id,
      businessName: "Greenfield Traders",
      businessType: "Wholesale Grocery",
      status: "ACTIVE",
      phone: "9800000001",
      email: "merchant@greenfield.in",
      address: "Shop No. 5, Market Yard",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      description: "Trusted wholesale grocery supplier serving residential societies since 2010.",
    },
  });
  console.log("✓ Merchant created:", merchant.businessName);

  // Link merchant to societies
  for (const society of societies) {
    await prisma.merchantServiceArea.upsert({
      where: { merchantId_societyId: { merchantId: merchant.id, societyId: society.id } },
      update: {},
      create: { merchantId: merchant.id, societyId: society.id },
    });
  }

  // ─── Merchant Products + Inventory ──────────────────────────────────────
  const merchantProductData = [
    { slug: "aashirvaad-whole-wheat-atta", basePrice: 320, mrp: 395, qty: 500 },
    { slug: "fortune-sunflower-oil", basePrice: 175, mrp: 210, qty: 300 },
    { slug: "tata-sampann-toor-dal", basePrice: 145, mrp: 180, qty: 400 },
    { slug: "surf-excel-easy-wash", basePrice: 110, mrp: 140, qty: 200 },
    { slug: "amul-full-cream-milk-1l", basePrice: 62, mrp: 68, qty: 1000 },
    { slug: "india-gate-basmati-rice", basePrice: 285, mrp: 350, qty: 350 },
    { slug: "saffola-active-oil-5l", basePrice: 650, mrp: 790, qty: 150 },
    { slug: "vim-dishwash-bar", basePrice: 38, mrp: 50, qty: 800 },
  ];

  for (const mpd of merchantProductData) {
    const product = createdProducts[mpd.slug];
    if (!product) continue;

    const existingMp = await prisma.merchantProduct.findUnique({
      where: {
        merchantId_productId_variantId: {
          merchantId: merchant.id,
          productId: product.id,
          variantId: "",
        },
      },
    });

    let mp;
    if (existingMp) {
      mp = existingMp;
    } else {
      mp = await prisma.merchantProduct.create({
        data: {
          merchantId: merchant.id,
          productId: product.id,
          basePrice: mpd.basePrice,
          mrp: mpd.mrp,
          isActive: true,
          bulkTiers: [
            { minQty: 10, price: mpd.basePrice * 0.95 },
            { minQty: 50, price: mpd.basePrice * 0.90 },
            { minQty: 100, price: mpd.basePrice * 0.85 },
          ],
        },
      });

      await prisma.inventory.create({
        data: {
          merchantProductId: mp.id,
          totalQty: mpd.qty,
          availableQty: mpd.qty,
          reservedQty: 0,
          unit: "units",
        },
      });
    }
  }
  console.log("✓ Merchant products + inventory created");

  // ─── Resident Users ──────────────────────────────────────────────────────
  const residentHash = await bcrypt.hash("Resident@1234", 12);
  const residents = [
    { email: "resident1@example.com", firstName: "Rahul", lastName: "Sharma", flat: "A-101" },
    { email: "resident2@example.com", firstName: "Priya", lastName: "Verma", flat: "B-204" },
    { email: "resident3@example.com", firstName: "Amit", lastName: "Kumar", flat: "C-305" },
    { email: "resident4@example.com", firstName: "Sunita", lastName: "Singh", flat: "A-102" },
    { email: "resident5@example.com", firstName: "Vikram", lastName: "Gupta", flat: "D-401" },
  ];

  for (const r of residents) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: {
        email: r.email,
        passwordHash: residentHash,
        role: UserRole.RESIDENT,
        status: UserStatus.ACTIVE,
        profile: {
          create: { firstName: r.firstName, lastName: r.lastName, flatNumber: r.flat },
        },
      },
    });

    await prisma.societyMembership.upsert({
      where: { userId_societyId: { userId: user.id, societyId: societies[0].id } },
      update: {},
      create: {
        userId: user.id,
        societyId: societies[0].id,
        role: "MEMBER",
        status: "APPROVED",
        flatNumber: r.flat,
        joinedAt: new Date(),
      },
    });
  }
  console.log("✓ Resident users created:", residents.length);

  // ─── Active Bulk Deal ────────────────────────────────────────────────────
  const attaProduct = createdProducts["aashirvaad-whole-wheat-atta"];
  if (attaProduct) {
    const deal = await prisma.bulkDeal.upsert({
      where: { id: "seed-deal-atta-001" },
      update: {},
      create: {
        id: "seed-deal-atta-001",
        societyId: societies[0].id,
        merchantId: merchant.id,
        productId: attaProduct.id,
        title: "Community Wheat Atta Deal — Sunrise Apartments",
        description:
          "Join together to order Aashirvaad Whole Wheat Atta in bulk and save up to 19% vs MRP. Minimum 150 kg to qualify.",
        status: "OPEN",
        basePrice: 320,
        minQty: 150,
        targetQty: 300,
        maxQty: 500,
        currentQty: 270,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        deliveryWindowDays: 3,
        cancellationPolicy: "Commitments can be cancelled before the deal qualifies.",
        paymentModel: "PAY_ON_CONFIRM",
      },
    });

    await prisma.bulkDealTier.deleteMany({ where: { dealId: deal.id } });
    await prisma.bulkDealTier.createMany({
      data: [
        { dealId: deal.id, minQty: 150, price: 305, label: "Starter Bulk", sortOrder: 1 },
        { dealId: deal.id, minQty: 250, price: 290, label: "Super Bulk", sortOrder: 2 },
        { dealId: deal.id, minQty: 400, price: 275, label: "Mega Bulk", sortOrder: 3 },
      ],
    });

    console.log("✓ Active bulk deal created:", deal.title);
  }

  // ─── Platform Settings ───────────────────────────────────────────────────
  await prisma.platformSetting.upsert({
    where: { key: "platform.name" },
    update: {},
    create: { key: "platform.name", value: JSON.stringify("SocietyBuy"), category: "branding" },
  });
  await prisma.platformSetting.upsert({
    where: { key: "platform.commission_rate" },
    update: {},
    create: { key: "platform.commission_rate", value: JSON.stringify(10), category: "billing" },
  });

  console.log("\n✅ Seed completed successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin:    admin@societybuy.in / Admin@1234");
  console.log("  Merchant: merchant@greenfield.in / Merchant@1234");
  console.log("  Resident: resident1@example.com / Resident@1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
