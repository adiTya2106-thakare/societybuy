import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          status: "ACTIVE" as const,
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { city: { contains: search, mode: "insensitive" as const } },
            { pincode: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { status: "ACTIVE" as const };

    const [total, societies] = await Promise.all([
      prisma.society.count({ where }),
      prisma.society.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          pincode: true,
          totalFlats: true,
          _count: { select: { memberships: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: societies,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/societies]", error);
    return NextResponse.json({ error: "Failed to fetch societies" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessionRole = (session.user as { role?: string }).role;
  if (sessionRole !== "PLATFORM_ADMIN" && sessionRole !== "SOCIETY_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, address, city, state, pincode, totalFlats, description } = body;

    if (!name || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const slug =
      name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") +
      "-" +
      pincode;

    const society = await prisma.society.create({
      data: {
        name,
        slug,
        description,
        address,
        city,
        state,
        pincode,
        totalFlats: totalFlats ? parseInt(totalFlats) : 0,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ data: society }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/societies]", error);
    return NextResponse.json({ error: "Failed to create society" }, { status: 500 });
  }
}
