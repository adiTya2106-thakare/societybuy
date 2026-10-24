"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, ShoppingCart, Star } from "lucide-react";
import { formatCurrency, calculateDiscountPercent } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  brand?: string;
  imageUrls: string[];
  merchantProducts: Array<{
    id: string;
    basePrice: string;
    mrp: string;
    bulkTiers: unknown[];
    merchant: { id: string; businessName: string };
  }>;
  category: { name: string };
  _count: { reviews: number };
}

function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const mp = product.merchantProducts[0];
  const price = mp ? Number(mp.basePrice) : 0;
  const mrp = mp ? Number(mp.mrp) : 0;
  const discount = calculateDiscountPercent(mrp, price);

  const addToCart = async () => {
    if (!mp) return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, merchantProductId: mp.id, qty: 1 }),
      });
      if (res.ok) {
        toast({ title: "Added to cart!", description: product.name });
      } else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all overflow-hidden">
      <Link href={`/app/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.imageUrls[0] ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0">
              {discount}% off
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <Link href={`/app/products/${product.id}`}>
          <p className="text-xs text-gray-400 mb-0.5">{product.category.name}</p>
          <p className="font-medium text-gray-900 line-clamp-2 text-sm leading-snug hover:text-green-700">
            {product.name}
          </p>
          {product.brand && <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-1">
          <div>
            <span className="text-base font-bold text-gray-900">{formatCurrency(price)}</span>
            {mrp > price && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">{formatCurrency(mrp)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={addToCart}
            loading={adding}
            disabled={!mp}
            className="h-8 px-2 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "24",
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    clearTimeout(undefined);
    setTimeout(() => setDebouncedSearch(val), 400);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
        <p className="text-gray-500">Browse products and add to cart or join bulk deals</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products, brands..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-gray-100 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <ShoppingCart className="mx-auto mb-3 h-10 w-10" />
          <p className="font-medium">No products found</p>
          <p className="text-sm mt-1">Try a different search</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data?.data?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-500">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
