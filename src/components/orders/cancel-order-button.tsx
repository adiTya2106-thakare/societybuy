"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">Are you sure you want to cancel this order?</p>
        <Button
          variant="destructive"
          size="sm"
          loading={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
              const json = await res.json();
              if (!res.ok) {
                toast({ title: "Cannot cancel", description: json.error, variant: "destructive" });
              } else {
                toast({ title: "Order cancelled" });
                router.refresh();
              }
            } finally {
              setLoading(false);
              setConfirming(false);
            }
          }}
        >
          Yes, Cancel
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
          Keep Order
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setConfirming(true)}>
      Cancel Order
    </Button>
  );
}
