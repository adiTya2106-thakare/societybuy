import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { qty } = await request.json();

  if (Number(qty) < 0) {
    return NextResponse.json({ error: "Quantity cannot be negative" }, { status: 400 });
  }

  try {
    const cart = await prisma.shoppingCart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    if (Number(qty) === 0) {
      await prisma.cartItem.deleteMany({ where: { id, cartId: cart.id } });
      return NextResponse.json({ message: "Item removed" });
    }

    const updated = await prisma.cartItem.updateMany({
      where: { id, cartId: cart.id },
      data: { qty },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error("[PATCH /api/cart/items/[id]]", error);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const cart = await prisma.shoppingCart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    await prisma.cartItem.deleteMany({ where: { id, cartId: cart.id } });
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("[DELETE /api/cart/items/[id]]", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
