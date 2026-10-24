import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = await prisma.shoppingCart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrls: true,
                merchantProducts: {
                  where: { isActive: true },
                  take: 1,
                  select: { id: true, basePrice: true, mrp: true, bulkTiers: true },
                },
              },
            },
          },
          orderBy: { addedAt: "desc" },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ data: { items: [], itemCount: 0, total: 0 } });
    }

    const total = cart.items.reduce((acc: number, item: { qty: number; product: { merchantProducts: Array<{ basePrice: string | number }> } }) => {
      const mp = item.product.merchantProducts[0];
      const price = mp ? Number(mp.basePrice) : 0;
      return acc + price * Number(item.qty);
    }, 0);

    return NextResponse.json({
      data: { ...cart, itemCount: cart.items.length, total },
    });
  } catch (error) {
    console.error("[GET /api/cart]", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, merchantProductId, qty = 1, dealId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }
    if (Number(qty) <= 0) {
      return NextResponse.json({ error: "Quantity must be positive" }, { status: 400 });
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, status: "ACTIVE" },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get or create cart
    let cart = await prisma.shoppingCart.findUnique({ where: { userId: session.user.id } });
    if (!cart) {
      cart = await prisma.shoppingCart.create({ data: { userId: session.user.id } });
    }

    await prisma.cartItem.upsert({
      where: {
        cartId_productId_merchantProductId: {
          cartId: cart.id,
          productId,
          merchantProductId: merchantProductId ?? "",
        },
      },
      update: { qty },
      create: {
        cartId: cart.id,
        productId,
        merchantProductId,
        qty,
        dealId,
      },
    });

    return NextResponse.json({ message: "Item added to cart" }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/cart]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
