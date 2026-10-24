"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { TrendingDown, Plus, Minus } from "lucide-react";

interface CommitDealButtonProps {
  dealId: string;
  existingQty: number | null;
  isLoggedIn: boolean;
}

export function CommitDealButton({ dealId, existingQty, isLoggedIn }: CommitDealButtonProps) {
  const router = useRouter();
  const [qty, setQty] = useState(existingQty ?? 1);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!isLoggedIn) {
    return (
      <Button asChild className="w-full">
        <Link href="/login?next=/app/bulk-deals">Login to Join Deal</Link>
      </Button>
    );
  }

  const commit = async () => {
    if (qty <= 0) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Error", description: json.error, variant: "destructive" });
      } else {
        toast({ title: "Committed!", description: `Your commitment for ${qty} units has been recorded.` });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </button>
        <Input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="text-center w-20"
        />
        <button
          onClick={() => setQty(qty + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-500">units</span>
      </div>

      <Button onClick={commit} loading={loading} className="w-full">
        <TrendingDown className="mr-2 h-4 w-4" />
        {existingQty ? "Update Commitment" : "Commit to This Deal"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        No payment now — you only pay if the deal qualifies
      </p>
    </div>
  );
}
