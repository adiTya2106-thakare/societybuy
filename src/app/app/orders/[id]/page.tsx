import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Package, MapPin, CreditCard, CheckCircle } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${id}`, {
    headers: { cookie: `next-auth.session-token=${id}` },
    cache: "no-store",
  });

  // Fall back to direct DB query
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payment: true,
      address: true,
      invoice: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      merchant: { select: { businessName: true, phone: true } },
      deal: { select: { title: true, status: true } },
    },
  });

  if (!order || order.userId !== session?.user?.id) notFound();

  const canCancel = ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"].includes(order.status);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/app/orders" className="text-sm text-gray-500 hover:text-green-700">
          ← Back to Orders
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge
          variant={
            order.status === "DELIVERED" ? "success" :
            order.status === "CANCELLED" ? "destructive" :
            order.status === "CONFIRMED" ? "info" : "secondary"
          }
        >
          {order.status.replace(/_/g, " ")}
        </Badge>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {order.items.map((item: { id: string; imageUrl?: string | null; productName: string; qty: unknown; unitPrice: unknown; totalPrice: unknown }) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.productName} className="h-12 w-12 rounded-lg object-cover bg-gray-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">{Number(item.qty)} × {formatCurrency(Number(item.unitPrice))}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(Number(item.totalPrice))}</p>
            </div>
          ))}

          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            {Number(order.deliveryFee) > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span><span>{formatCurrency(Number(order.deliveryFee))}</span>
              </div>
            )}
            {Number(order.taxAmount) > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Tax</span><span>{formatCurrency(Number(order.taxAmount))}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-gray-900 text-base border-t pt-2">
              <span>Total</span><span>{formatCurrency(Number(order.totalAmount))}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery address */}
      {order.address && (
        <Card>
          <CardContent className="flex gap-3 p-4">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Delivery Address</p>
              <p className="text-gray-500 mt-0.5">
                {order.address.flatNumber}, {order.address.building}, {order.address.societyName}
              </p>
              <p className="text-gray-500">{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment */}
      {order.payment && (
        <Card>
          <CardContent className="flex gap-3 p-4">
            <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Payment</p>
              <p className="text-gray-500 mt-0.5">
                Status: <span className={order.payment.status === "COMPLETED" ? "text-green-600" : "text-amber-600"}>
                  {order.payment.status}
                </span>
                {order.payment.isSimulated && " (Dev simulation)"}
              </p>
              <p className="text-gray-500">Method: {order.payment.method}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {order.statusHistory.map((h: { id: string; status: string; note?: string | null; createdAt: Date }, i: number) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  {i < order.statusHistory.length - 1 && (
                    <div className="mt-1 h-6 w-px bg-gray-200" />
                  )}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-gray-900">{h.status.replace(/_/g, " ")}</p>
                  {h.note && <p className="text-xs text-gray-500">{h.note}</p>}
                  <p className="text-xs text-gray-400">{formatDateTime(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {canCancel && (
        <Card>
          <CardContent className="p-4 flex gap-3">
            <CancelOrderButton orderId={order.id} />
          </CardContent>
        </Card>
      )}

      {order.invoice && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Invoice: {order.invoice.invoiceNumber}</p>
        </div>
      )}
    </div>
  );
}
