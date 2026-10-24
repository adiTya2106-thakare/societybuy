import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CommitDealButton } from "@/components/deals/commit-deal-button";
import { formatCurrency, dealProgressPercent, timeUntil, formatDate } from "@/lib/utils";
import { Users, Clock, TrendingDown, Package, CheckCircle, AlertTriangle, Info } from "lucide-react";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const deal = await prisma.bulkDeal.findUnique({
    where: { id },
    include: {
      product: {
        include: { category: true, variants: { where: { isActive: true } } },
      },
      tiers: { orderBy: { minQty: "asc" } },
      society: { select: { id: true, name: true } },
      merchant: { select: { businessName: true, rating: true } },
      _count: { select: { commitments: true } },
    },
  });

  if (!deal) notFound();

  const userCommitment = session?.user
    ? await prisma.dealCommitment.findUnique({
        where: { dealId_userId: { dealId: id, userId: session.user.id } },
      })
    : null;

  const progressPct = dealProgressPercent(Number(deal.currentQty), Number(deal.targetQty));
  const isActive = deal.status === "OPEN" || deal.status === "QUALIFIED";
  const hasExpired = new Date(deal.endsAt) < new Date();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/app/bulk-deals" className="text-sm text-gray-500 hover:text-green-700">
          ← Back to Bulk Deals
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Deal info */}
        <div className="lg:col-span-3 space-y-4">
          {deal.product.imageUrls[0] && (
            <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
              <img
                src={deal.product.imageUrls[0]}
                alt={deal.product.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{deal.title}</h1>
                  <p className="text-gray-500 mt-1">{deal.product.name}</p>
                  {deal.product.brand && (
                    <p className="text-sm text-gray-400">Brand: {deal.product.brand}</p>
                  )}
                </div>
                <Badge
                  variant={
                    deal.status === "QUALIFIED" ? "success" :
                    deal.status === "OPEN" ? "info" :
                    deal.status === "FAILED" ? "destructive" : "secondary"
                  }
                  className="shrink-0"
                >
                  {deal.status}
                </Badge>
              </div>

              {deal.description && (
                <p className="text-sm text-gray-600">{deal.description}</p>
              )}

              {/* Tiers */}
              {deal.tiers.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm">Price Tiers</h3>
                  <div className="space-y-2">
                    {deal.tiers.map((tier: { id: string; minQty: unknown; maxQty: unknown; price: unknown }) => (
                      <div
                        key={tier.id}
                        className={`flex justify-between items-center rounded-lg px-3 py-2 text-sm border ${
                          Number(deal.currentQty) >= Number(tier.minQty)
                            ? "border-green-200 bg-green-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <span className="text-gray-600">
                          {Number(tier.minQty)}+ units
                          {tier.maxQty ? ` (up to ${Number(tier.maxQty)})` : ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-700">
                            {formatCurrency(Number(tier.price))} / unit
                          </span>
                          {Number(deal.currentQty) >= Number(tier.minQty) && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deal info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Base Price", value: formatCurrency(Number(deal.basePrice)) },
                  { label: "Minimum Qty", value: `${Number(deal.minQty)} units` },
                  { label: "Target Qty", value: `${Number(deal.targetQty)} units` },
                  { label: "Deadline", value: formatDate(deal.endsAt) },
                  { label: "Delivery Window", value: `${deal.deliveryWindowDays} days after close` },
                  { label: "Society", value: deal.society?.name ?? "All societies" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-medium text-gray-900 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {deal.cancellationPolicy && (
                <div className="flex gap-2 rounded-lg bg-blue-50 p-3 text-sm">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-blue-700">{deal.cancellationPolicy}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: progress + commit */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Community Progress</h3>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    <strong>{Number(deal.currentQty)}</strong> / {Number(deal.targetQty)} units
                  </span>
                  <span className="font-semibold text-green-600">{progressPct}%</span>
                </div>
                <Progress value={progressPct} className="h-3" />
                <p className="text-xs text-gray-500 mt-1.5">
                  {Number(deal.currentQty) < Number(deal.minQty)
                    ? `${Number(deal.minQty) - Number(deal.currentQty)} more needed to qualify`
                    : "✓ Minimum quantity reached!"}
                </p>
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-400" />
                  {deal._count.commitments} participants
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {hasExpired ? "Expired" : timeUntil(deal.endsAt)}
                </span>
              </div>

              {deal.qualifiedPrice && deal.status === "QUALIFIED" && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                  <p className="text-xs text-green-600 font-medium">QUALIFIED PRICE</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {formatCurrency(Number(deal.qualifiedPrice))}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">per unit</p>
                </div>
              )}

              {isActive && !hasExpired ? (
                <CommitDealButton
                  dealId={deal.id}
                  existingQty={userCommitment ? Number(userCommitment.qty) : null}
                  isLoggedIn={!!session?.user}
                />
              ) : (
                <div className="rounded-lg bg-gray-100 p-3 text-center text-sm text-gray-500">
                  {hasExpired ? "This deal has expired" : `Deal is ${deal.status.toLowerCase()}`}
                </div>
              )}

              {userCommitment && (
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm">
                  <p className="text-blue-700 font-medium">Your commitment: {Number(userCommitment.qty)} units</p>
                  <p className="text-blue-500 text-xs mt-0.5">Status: {userCommitment.status}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
