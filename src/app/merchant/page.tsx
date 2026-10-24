import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Package, TrendingUp, AlertTriangle, ShoppingBag, DollarSign } from "lucide-react";

export default async function MerchantDashboard() {
  const session = await auth();

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session!.user.id },
    include: {
      products: { take: 5, orderBy: { createdAt: "desc" } },
    },
  });

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Merchant account not found</h2>
        <p className="mt-2 text-gray-500">Contact platform admin to set up your merchant account</p>
      </div>
    );
  }

  const [totalOrders, pendingOrders, todayOrders, totalRevenue] = await Promise.all([
    prisma.order.count({ where: { merchantId: merchant.id } }),
    prisma.order.count({ where: { merchantId: merchant.id, status: { in: ["CONFIRMED", "PROCESSING"] } } }),
    prisma.order.count({
      where: {
        merchantId: merchant.id,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.order.aggregate({
      where: { merchantId: merchant.id, status: "DELIVERED" },
      _sum: { totalAmount: true },
    }),
  ]);

  const lowStockProducts = await prisma.merchantProduct.findMany({
    where: {
      merchantId: merchant.id,
      isActive: true,
      inventory: {
        availableQty: { lte: prisma.inventory.fields.lowStockThreshold },
      },
    },
    include: {
      product: { select: { name: true } },
      inventory: true,
    },
    take: 5,
  }).catch(() => []);

  const recentOrders = await prisma.order.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: { take: 1, select: { productName: true } },
      user: { select: { profile: { select: { firstName: true, lastName: true } } } },
    },
  });

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Orders", value: todayOrders, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Pending Fulfillment", value: pendingOrders, icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
    {
      label: "Total Revenue",
      value: formatCurrency(Number(totalRevenue._sum.totalAmount ?? 0)),
      icon: DollarSign,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{merchant.businessName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={merchant.status === "ACTIVE" ? "success" : "warning"}>
              {merchant.status}
            </Badge>
            <span className="text-gray-400 text-sm">Rating: {Number(merchant.rating)}/5</span>
          </div>
        </div>
        <Button asChild>
          <Link href="/merchant/products/new">+ Add Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-semibold text-gray-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Link href="/merchant/orders" className="text-xs text-green-600">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
            ) : (
              recentOrders.map((o: { id: string; orderNumber: string; status: string; totalAmount: unknown; items: Array<{ productName: string }> }) => (
                <div key={o.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">#{o.orderNumber}</p>
                    <p className="text-xs text-gray-400">{o.items[0]?.productName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={o.status === "DELIVERED" ? "success" : o.status === "CONFIRMED" ? "info" : "secondary"} className="text-xs">
                      {o.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(Number(o.totalAmount))}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Products summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Products</CardTitle>
            <Link href="/merchant/products" className="text-xs text-green-600">Manage</Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {merchant.products.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No products listed yet</p>
                <Button asChild size="sm" className="mt-2">
                  <Link href="/merchant/products/new">Add Your First Product</Link>
                </Button>
              </div>
            ) : (
              merchant.products.map((p: { id: string; isActive: boolean }) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-900 truncate flex-1">{p.id}</p>
                  <Badge variant={p.isActive ? "success" : "secondary"} className="text-xs">
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
