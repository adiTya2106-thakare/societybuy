"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface CartItem {
  id: string;
  qty: number;
  productId: string;
  product: {
    id: string;
    name: string;
    imageUrls: string[];
    merchantProducts: Array<{ id: string; basePrice: string; mrp: string }>;
  };
}

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, qty }: { id: string; qty: number }) => {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cart/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Item removed from cart" });
    },
  });

  const items: CartItem[] = data?.data?.items ?? [];
  const total: number = data?.data?.total ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Add some products to get started</p>
        <Button asChild className="mt-6">
          <Link href="/app/shop">
            <ShoppingBag className="mr-2 h-4 w-4" /> Browse Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const mp = item.product.merchantProducts[0];
            const price = mp ? Number(mp.basePrice) : 0;

            return (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {item.product.imageUrls[0] ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(price)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateMutation.mutate({ id: item.id, qty: Math.max(0, item.qty - 1) })}
                      className="flex h-7 w-7 items-center justify-center rounded-full border hover:bg-gray-100"
                      disabled={updateMutation.isPending}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateMutation.mutate({ id: item.id, qty: item.qty + 1 })}
                      className="flex h-7 w-7 items-center justify-center rounded-full border hover:bg-gray-100"
                      disabled={updateMutation.isPending}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeMutation.mutate(item.id)}
                      className="ml-2 text-red-400 hover:text-red-600"
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right shrink-0 w-20">
                    <p className="font-semibold text-gray-900">{formatCurrency(price * item.qty)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({items.length} items)</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery fee</span>
                <span className="text-green-600">₹40</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total + 40)}</span>
              </div>
              <Button asChild className="w-full mt-2">
                <Link href="/app/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/app/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
