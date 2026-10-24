import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, dealProgressPercent, timeUntil } from "@/lib/utils";
import { TrendingDown, Clock, Users } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  OPEN: { label: "Open", variant: "info" },
  QUALIFIED: { label: "Qualified ✓", variant: "success" },
  SCHEDULED: { label: "Upcoming", variant: "warning" },
  FULFILLING: { label: "Fulfilling", variant: "secondary" },
  COMPLETED: { label: "Completed", variant: "success" },
  FAILED: { label: "Failed", variant: "destructive" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export default async function BulkDealsPage() {
  const deals = await prisma.bulkDeal.findMany({
    where: { status: { in: ["OPEN", "QUALIFIED", "SCHEDULED"] } },
    orderBy: { endsAt: "asc" },
    include: {
      product: { select: { name: true, imageUrls: true, brand: true } },
      tiers: { orderBy: { minQty: "asc" } },
      society: { select: { name: true } },
      _count: { select: { commitments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Deals</h1>
        <p className="text-gray-500">Join community deals and unlock better prices together</p>
      </div>

      {deals.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center text-gray-400">
            <TrendingDown className="mx-auto mb-3 h-10 w-10" />
            <p className="font-medium">No active deals right now</p>
            <p className="text-sm mt-1">Check back soon or ask your society admin to create one</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal: { id: string; title: string; product: { name: string; imageUrls: string[] }; status: string; currentQty: unknown; targetQty: unknown; minQty: unknown; basePrice: unknown; endsAt: Date; tiers: Array<{ id: string; price: unknown }>; society?: { name: string } | null; _count: { commitments: number } }) => {
            const progressPct = dealProgressPercent(Number(deal.currentQty), Number(deal.targetQty));
            const bestPrice = deal.tiers[0]?.price ? Number(deal.tiers[0].price) : Number(deal.basePrice);
            const cfg = statusConfig[deal.status] ?? statusConfig.OPEN;

            return (
              <Card key={deal.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {deal.product.imageUrls[0] && (
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={deal.product.imageUrls[0]}
                      alt={deal.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-2">{deal.title}</p>
                      <p className="text-sm text-gray-500">{deal.product.name}</p>
                      {deal.society && (
                        <p className="text-xs text-gray-400 mt-0.5">{deal.society.name}</p>
                      )}
                    </div>
                    <Badge variant={cfg.variant} className="shrink-0">{cfg.label}</Badge>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{Number(deal.currentQty)} / {Number(deal.targetQty)} {deal.status === "QUALIFIED" ? "✓ Qualified!" : "needed"}</span>
                      <span className="font-medium text-gray-700">{progressPct}%</span>
                    </div>
                    <Progress value={progressPct} className={deal.status === "QUALIFIED" ? "[&>div]:bg-emerald-500" : ""} />
                    {Number(deal.currentQty) < Number(deal.minQty) && (
                      <p className="text-xs text-amber-600 mt-1">
                        Need {Number(deal.minQty) - Number(deal.currentQty)} more to qualify
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{deal._count.commitments} joined
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{timeUntil(deal.endsAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">{formatCurrency(bestPrice)}</span>
                      {Number(deal.basePrice) > bestPrice && (
                        <p className="text-xs text-gray-400 line-through">{formatCurrency(Number(deal.basePrice))}</p>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/app/bulk-deals/${deal.id}`}>
                      View & Join Deal
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
