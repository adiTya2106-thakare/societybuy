"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingCart, 
  Star, 
  Sparkles, 
  Plus, 
  Minus, 
  Check, 
  Filter, 
  Building2,
  Package,
  Layers,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  brand?: string;
  imageUrls: string[];
  packSize?: string;
  merchantProducts?: Array<{
    id: string;
    basePrice: string;
    mrp: string;
    bulkTiers?: unknown[];
    merchant?: { id: string; businessName: string };
  }>;
  category?: { name: string };
  price?: number;
  mrp?: number;
}

const fallbackProducts: Product[] = [
  {
    id: "fp1",
    name: "Aashirvaad Superior MP Atta",
    brand: "ITC",
    packSize: "10 kg bag",
    imageUrls: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Atta, Rice & Grains" },
    price: 375,
    mrp: 460,
  },
  {
    id: "fp2",
    name: "Fortune Sunlite Refined Sunflower Oil",
    brand: "Adani Wilmar",
    packSize: "5 Litre Can",
    imageUrls: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Cooking Oil & Ghee" },
    price: 580,
    mrp: 720,
  },
  {
    id: "fp3",
    name: "Tata Sampann Unpolished Toor Dal",
    brand: "Tata Consumer",
    packSize: "2 kg pack",
    imageUrls: ["https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Pulses & Dals" },
    price: 275,
    mrp: 340,
  },
  {
    id: "fp4",
    name: "India Gate Basmati Rice Feast Rozzana",
    brand: "KRBL",
    packSize: "5 kg bag",
    imageUrls: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Atta, Rice & Grains" },
    price: 390,
    mrp: 480,
  },
  {
    id: "fp5",
    name: "Farm-Fresh Nashik Red Onions",
    brand: "Nashik APMC Mandi",
    packSize: "5 kg mesh bag",
    imageUrls: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Fresh Vegetables" },
    price: 130,
    mrp: 180,
  },
  {
    id: "fp6",
    name: "Himachal Royal Delicious Apples",
    brand: "Shimla Orchard Direct",
    packSize: "1 kg box (4-5 pcs)",
    imageUrls: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Fresh Vegetables" },
    price: 160,
    mrp: 220,
  },
  {
    id: "fp7",
    name: "Surf Excel Matic Top Load Detergent",
    brand: "Hindustan Unilever",
    packSize: "4 kg + 2 kg Free",
    imageUrls: ["https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Cleaning Supplies" },
    price: 760,
    mrp: 950,
  },
  {
    id: "fp8",
    name: "Amul Pasteurised Salted Butter",
    brand: "Amul",
    packSize: "500 g block",
    imageUrls: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80"],
    category: { name: "Dairy & Bakery" },
    price: 245,
    mrp: 275,
  },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [cartQuantities, setCartQuantities] = useState<{ [id: string]: number }>({});
  const [sortBy, setSortBy] = useState("popular");

  // Fetch products from real API
  const { data, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/products?limit=50&search=${encodeURIComponent(search)}`);
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },
  });

  const apiProducts: Product[] = data?.data && data.data.length > 0 ? data.data : fallbackProducts;

  const handleUpdateQty = async (product: Product, delta: number) => {
    const current = cartQuantities[product.id] || 0;
    const next = Math.max(0, current + delta);
    setCartQuantities((prev) => ({ ...prev, [product.id]: next }));

    // Try posting to API cart
    const mp = product.merchantProducts?.[0];
    if (mp) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            merchantProductId: mp.id,
            qty: next,
          }),
        });
      } catch {
        // Fallback gracefully
      }
    }

    if (delta > 0) {
      toast({
        title: "Added to Cart!",
        description: `${product.name} (${next} in cart)`,
      });
    }
  };

  const filtered = apiProducts.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const catName = p.category?.name || "";
    const catMatch = selectedCat === "All" || catName.toLowerCase().includes(selectedCat.toLowerCase()) || selectedCat.toLowerCase().includes(catName.toLowerCase());
    return nameMatch && catMatch;
  });

  const totalCartItems = Object.values(cartQuantities).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Delivering to: Greenfield Heights, Tower B</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Daily Essentials & Pantry Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Individual household orders • Wholesale society pricing unlocks automatically at checkout
          </p>
        </div>

        {totalCartItems > 0 && (
          <Button asChild size="lg" className="bg-[#166534] hover:bg-[#14532D] text-white rounded-full font-bold shadow-md shadow-emerald-900/10 gap-2">
            <Link href="/app/cart">
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart ({totalCartItems} Items)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by brand (Aashirvaad, Fortune, Tata), item, or staple..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl bg-white border-slate-200 text-xs py-2.5 h-auto focus:border-emerald-600 focus:ring-emerald-600/10"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="popular">Most Popular in Society</option>
              <option value="discount">Highest Savings %</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["All", "Atta, Rice & Grains", "Cooking Oil & Ghee", "Pulses & Dals", "Fresh Vegetables", "Cleaning Supplies", "Dairy & Bakery"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? "bg-[#166534] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((prod) => {
          const mp = prod.merchantProducts?.[0];
          const price = prod.price || (mp ? Number(mp.basePrice) : 350);
          const mrp = prod.mrp || (mp ? Number(mp.mrp) : 420);
          const savings = mrp - price;
          const discountPct = Math.round((savings / mrp) * 100);
          const qty = cartQuantities[prod.id] || 0;
          const imageSrc = prod.imageUrls?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80";

          return (
            <div
              key={prod.id}
              className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden card-shadow-hover flex flex-col justify-between transition-all"
            >
              {/* Image & Discount Badge */}
              <div className="relative aspect-square w-full bg-slate-50 overflow-hidden group">
                <img
                  src={imageSrc}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {discountPct > 0 && (
                  <div className="absolute top-2.5 left-2.5 bg-[#F59E0B] text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                    {discountPct}% OFF
                  </div>
                )}

                <div className="absolute bottom-2 right-2 bg-emerald-950/80 backdrop-blur-sm text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Society Verified
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {prod.brand || "Fresh Produce"}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 mt-0.5">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{prod.packSize || "Standard Pack"}</p>

                  {/* Pricing */}
                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-black text-[#166534]">₹{price}</span>
                    {mrp > price && (
                      <span className="text-xs text-slate-400 line-through">₹{mrp}</span>
                    )}
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
                      Save ₹{savings}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {qty === 0 ? (
                    <Button
                      onClick={() => handleUpdateQty(prod, 1)}
                      className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs py-2 h-9 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Flat Cart</span>
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-1">
                      <button
                        onClick={() => handleUpdateQty(prod, -1)}
                        className="w-7 h-7 rounded-lg bg-white text-emerald-800 flex items-center justify-center font-bold text-xs shadow-sm hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-emerald-900">{qty}</span>
                      <button
                        onClick={() => handleUpdateQty(prod, 1)}
                        className="w-7 h-7 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:bg-[#14532D]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
