import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Truck, Package, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default async function DeliveryPage() {
  const session = await auth();

  const partner = await prisma.deliveryPartner.findUnique({
    where: { userId: session!.user.id },
  });

  const assignments = partner
    ? await prisma.deliveryAssignment.findMany({
        where: {
          partnerId: partner.id,
          status: { notIn: ["DELIVERED", "CANCELLED", "RETURNED"] },
        },
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              address: true,
              items: { take: 1, select: { productName: true } },
            },
          },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
        <p className="text-gray-500">{assignments.length} active assignments</p>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center text-gray-400">
            <Truck className="mx-auto mb-3 h-10 w-10" />
            <p>No deliveries assigned right now</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((a: { id: string; status: string; order: { orderNumber: string; totalAmount: unknown; address: { flatNumber: string; building: string; societyName: string } | null; items: Array<{ productName: string }> } }) => (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">#{a.order.orderNumber}</p>
                    <Badge
                      variant={
                        a.status === "DELIVERED" ? "success" :
                        a.status === "IN_TRANSIT" ? "info" :
                        a.status === "PICKED_UP" ? "secondary" : "warning"
                      }
                    >
                      {a.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {a.order.items[0]?.productName ?? "Order"}
                  </p>
                  {a.order.address && (
                    <p className="text-xs text-gray-400 mt-1">
                      {a.order.address.flatNumber}, {a.order.address.building}, {a.order.address.societyName}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(Number(a.order.totalAmount))}
                  </p>
                  <Link href={`/delivery/assignments/${a.id}`}>
                    <Button size="sm" className="mt-2">Update</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
