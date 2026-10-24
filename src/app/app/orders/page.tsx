import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package } from "lucide-react";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
  PENDING_PAYMENT: "warning",
  PAYMENT_FAILED: "destructive",
  CONFIRMED: "info",
  PROCESSING: "info",
  PACKED: "secondary",
  DISPATCHED: "secondary",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUND_REQUESTED: "warning",
  REFUNDED: "secondary",
};

export default async function OrdersPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { take: 2, select: { productName: true, qty: true, imageUrl: true } },
      payment: { select: { status: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500">{orders.length} orders total</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center text-gray-400">
            <Package className="mx-auto mb-3 h-10 w-10" />
            <p className="font-medium">No orders yet</p>
            <Button asChild className="mt-4">
              <Link href="/app/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order: { id: string; orderNumber: string; status: string; totalAmount: unknown; createdAt: Date; items: Array<{ productName: string }>; payment: { status: string } | null }) => (
            <Card key={order.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {order.items.map((i: { productName: string }) => i.productName).join(", ")}
                          {order.items.length > 2 && "..."}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={statusColors[order.status] ?? "secondary"} className="text-xs">
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {formatCurrency(Number(order.totalAmount))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/app/orders/${order.id}`}>View Order</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
