import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate, dealProgressPercent, timeUntil } from "@/lib/utils";
import {
  TrendingDown,
  ShoppingBag,
  Package,
  PiggyBank,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";

export default async function AppDashboard() {
  const session = await auth();

  const [recentOrders, activeDeals, membership] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session!.user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: { take: 1, select: { productName: true, imageUrl: true } },
        payment: { select: { status: true } },
      },
    }),
    prisma.bulkDeal.findMany({
      where: { status: { in: ["OPEN", "QUALIFIED"] }, endsAt: { gt: new Date() } },
      take: 3,
      orderBy: { endsAt: "asc" },
      include: {
        product: { select: { name: true, imageUrls: true } },
        tiers: { orderBy: { minQty: "asc" } },
      },
    }),
    prisma.societyMembership.findFirst({
      where: { userId: session!.user.id, status: "APPROVED" },
      include: { society: { select: { name: true } } },
    }),
  ]);

  const totalSavings = await prisma.orderItem.aggregate({
    where: {
      order: { userId: session!.user.id, status: "DELIVERED" },
    },
    _sum: { discount: true },
  });

  const stats = [
    {
      label: "Total Orders",
      value: recentOrders.length,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active Deals",
      value: activeDeals.length,
      icon: TrendingDown,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Savings",
      value: formatCurrency(Number(totalSavings._sum.discount ?? 0)),
      icon: PiggyBank,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "My Society",
      value: membership?.society.name ?? "Not joined",
      icon: ShoppingBag,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {session?.user?.name?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="mt-1 text-gray-500">
          {membership
            ? `Shopping with ${membership.society.name}`
            : "Join a society to unlock bulk deals"}
        </p>
      </div>

      {/* Society join prompt */}
      {!membership && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">You haven&apos;t joined a society yet</p>
              <p className="text-sm text-amber-600">Join your residential society to access bulk deals</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href="/app/profile">Join Society</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="font-semibold text-gray-900 truncate">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Deals */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Bulk Deals</h2>
          <Link href="/app/bulk-deals" className="text-sm text-green-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {activeDeals.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-400">
              <TrendingDown className="mx-auto mb-2 h-8 w-8" />
              <p>No active deals right now. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeDeals.map((deal: { id: string; title: string; product: { name: string }; status: string; currentQty: unknown; targetQty: unknown; basePrice: unknown; endsAt: Date; tiers: Array<{ price: unknown }> }) => (
              <Card key={deal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-2">{deal.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{deal.product.name}</p>
                    </div>
                    <Badge variant={deal.status === "QUALIFIED" ? "success" : "info"} className="shrink-0">
                      {deal.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span className="font-medium">
                        {dealProgressPercent(Number(deal.currentQty), Number(deal.targetQty))}%
                      </span>
                    </div>
                    <Progress value={dealProgressPercent(Number(deal.currentQty), Number(deal.targetQty))} />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {timeUntil(deal.endsAt)}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {deal.tiers[0] ? formatCurrency(Number(deal.tiers[0].price)) : formatCurrency(Number(deal.basePrice))}
                    </span>
                  </div>

                  <Button asChild className="mt-3 w-full" size="sm">
                    <Link href={`/app/bulk-deals/${deal.id}`}>View Deal</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/app/orders" className="text-sm text-green-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-400">
              <Package className="mx-auto mb-2 h-8 w-8" />
              <p>No orders yet. Start shopping!</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/app/shop">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: { id: string; orderNumber: string; status: string; totalAmount: unknown; createdAt: Date; items: Array<{ productName: string }> }) => (
              <Card key={order.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {order.items[0]?.productName ?? "Order items"}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        order.status === "DELIVERED" ? "success" :
                        order.status === "CANCELLED" ? "destructive" :
                        order.status === "CONFIRMED" ? "info" : "secondary"
                      }
                      className="text-xs"
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(Number(order.totalAmount))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
