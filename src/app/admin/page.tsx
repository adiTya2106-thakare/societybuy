import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Users, Building2, ShoppingBag, Package, TrendingDown, CreditCard } from "lucide-react";

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalSocieties,
    totalMerchants,
    totalOrders,
    activeDeals,
    pendingMerchants,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.society.count({ where: { status: "ACTIVE" } }),
    prisma.merchant.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.bulkDeal.count({ where: { status: { in: ["OPEN", "QUALIFIED"] } } }),
    prisma.merchant.count({ where: { status: "PENDING_VERIFICATION" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { profile: { select: { firstName: true, lastName: true } } } },
        merchant: { select: { businessName: true } },
      },
    }),
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600 bg-blue-50", href: "/admin/users" },
    { label: "Societies", value: totalSocieties, icon: Building2, color: "text-green-600 bg-green-50", href: "/admin/societies" },
    { label: "Active Merchants", value: totalMerchants, icon: ShoppingBag, color: "text-purple-600 bg-purple-50", href: "/admin/merchants" },
    { label: "Total Orders", value: totalOrders, icon: Package, color: "text-orange-600 bg-orange-50", href: "/admin/orders" },
    { label: "Active Deals", value: activeDeals, icon: TrendingDown, color: "text-emerald-600 bg-emerald-50", href: "/admin/deals" },
    { label: "Total Revenue", value: formatCurrency(Number(totalRevenue._sum.totalAmount ?? 0)), icon: CreditCard, color: "text-red-600 bg-red-50", href: "/admin/payments" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-500">SocietyBuy Administration</p>
        </div>
        {pendingMerchants > 0 && (
          <Link href="/admin/merchants" className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 hover:bg-amber-100">
            <span>⚠</span> {pendingMerchants} merchant(s) pending verification
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className={`mb-3 inline-flex rounded-lg p-2 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            Recent Orders
            <Link href="/admin/orders" className="text-xs text-green-600 font-normal">View all</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Merchant</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((o: { id: string; orderNumber: string; status: string; totalAmount: unknown; createdAt: Date; user: { profile: { firstName: string; lastName: string } | null }; merchant: { businessName: string } | null }) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-green-700 hover:underline">
                        #{o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600">
                      {o.user.profile ? `${o.user.profile.firstName} ${o.user.profile.lastName}` : "—"}
                    </td>
                    <td className="py-3 text-gray-600">{o.merchant?.businessName ?? "—"}</td>
                    <td className="py-3 text-gray-400">{formatDate(o.createdAt)}</td>
                    <td className="py-3 font-medium">{formatCurrency(Number(o.totalAmount))}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          o.status === "DELIVERED" ? "success" :
                          o.status === "CANCELLED" ? "destructive" :
                          o.status === "CONFIRMED" ? "info" : "secondary"
                        }
                        className="text-xs"
                      >
                        {o.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
