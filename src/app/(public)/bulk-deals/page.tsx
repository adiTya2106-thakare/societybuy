"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Clock, 
  Flame, 
  Sparkles, 
  Plus, 
  Check, 
  Search, 
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const allDeals = [
  {
    id: "bd1",
    name: "Aashirvaad Superior MP Sharbati Atta",
    category: "Flour & Grains",
    packSize: "10 kg bag",
    regularPrice: 460,
    bulkPrice: 375,
    committedQty: 74,
    targetQty: 80,
    timeLeft: "4 hrs 10m",
    society: "Greenfield Heights (Towers A & B)",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd2",
    name: "Fortune Sunlite Refined Sunflower Oil",
    category: "Cooking Oils",
    packSize: "5 Litre Jerry Can",
    regularPrice: 720,
    bulkPrice: 580,
    committedQty: 44,
    targetQty: 50,
    timeLeft: "7 hrs 25m",
    society: "Greenfield Heights (All Wings)",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd3",
    name: "Tata Sampann Unpolished Toor Dal",
    category: "Pulses & Dals",
    packSize: "2 kg vacuum pack",
    regularPrice: 340,
    bulkPrice: 275,
    committedQty: 58,
    targetQty: 60,
    timeLeft: "2 hrs 15m",
    society: "Greenfield Heights (Tower B)",
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd4",
    name: "Farm-Fresh Nashik Red Onions",
    category: "Fresh Farm",
    packSize: "10 kg breathable sack",
    regularPrice: 350,
    bulkPrice: 240,
    committedQty: 96,
    targetQty: 100,
    timeLeft: "1 hr 45m",
    society: "Greenfield Heights (APMC Direct Drop)",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd5",
    name: "Surf Excel Matic Top Load Detergent",
    category: "Cleaning & Care",
    packSize: "4 kg + 2 kg Free Pack",
    regularPrice: 950,
    bulkPrice: 760,
    committedQty: 32,
    targetQty: 40,
    timeLeft: "9 hrs 50m",
    society: "Greenfield Heights (Clubhouse Drop)",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd6",
    name: "Devgad Alphonso Mangoes (GI Tagged)",
    category: "Fresh Farm",
    packSize: "1 Dozen Box (Grade A)",
    regularPrice: 1200,
    bulkPrice: 890,
    committedQty: 49,
    targetQty: 50,
    timeLeft: "45 mins",
    society: "Greenfield Heights (Orchard Direct)",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd7",
    name: "India Gate Basmati Rice Feast Rozzana",
    category: "Flour & Grains",
    packSize: "5 kg bag",
    regularPrice: 480,
    bulkPrice: 390,
    committedQty: 38,
    targetQty: 45,
    timeLeft: "12 hrs",
    society: "Greenfield Heights (Tower A & C)",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bd8",
    name: "Amul Cow Ghee Tin",
    category: "Cooking Oils",
    packSize: "1 Litre Tin",
    regularPrice: 650,
    bulkPrice: 560,
    committedQty: 40,
    targetQty: 40,
    timeLeft: "Unlocked",
    society: "Greenfield Heights (All Wings)",
    image: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80",
  },
];

export default function BulkDealsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deals, setDeals] = useState(allDeals);
  const [pledged, setPledged] = useState<{ [id: string]: number }>({});

  const handlePledge = (id: string) => {
    setPledged((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, committedQty: Math.min(d.committedQty + 1, d.targetQty) } : d))
    );
  };

  const filtered = deals.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#F8FAF5] min-h-screen text-[#17211B] antialiased">
      
      {/* Header */}
      <section className="py-12 lg:py-16 bg-white border-b border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 text-xs font-bold px-3 py-1 mb-3">
                <Flame className="w-3.5 h-3.5 fill-red-500" />
                <span>ACTIVE SOCIETY GROUP ORDERS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Live Bulk Deals in Your Society
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Pool with neighbours in Greenfield Heights. Individual flat billing, transparent wholesale rates, and guaranteed society gate drop.
              </p>
            </div>

            {/* Society Selector reminder */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-xs">
              <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold text-emerald-900">Greenfield Heights, Tower B</p>
                <p className="text-slate-500 text-[11px]">8 active bulk buying pools this week</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search deals by product, brand, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {["All", "Flour & Grains", "Cooking Oils", "Pulses & Dals", "Fresh Farm", "Cleaning & Care"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? "bg-[#166534] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((deal) => {
              const savings = deal.regularPrice - deal.bulkPrice;
              const savingsPct = Math.round((savings / deal.regularPrice) * 100);
              const progressPct = Math.round((deal.committedQty / deal.targetQty) * 100);
              const isPledged = pledged[deal.id] && pledged[deal.id] > 0;

              return (
                <div 
                  key={deal.id}
                  className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden card-shadow-hover flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden group">
                    <img 
                      src={deal.image} 
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#F59E0B] text-amber-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                      SAVE ₹{savings} ({savingsPct}%)
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{deal.timeLeft}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">{deal.category}</span>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 mt-0.5">{deal.name}</h3>
                      <p className="text-[11px] text-slate-500">{deal.packSize}</p>

                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 line-through">MRP: ₹{deal.regularPrice}</span>
                          <div className="text-base font-black text-[#166534]">₹{deal.bulkPrice}</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          APMC Direct
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>Pool Quota</span>
                          <span className="text-emerald-700">{deal.committedQty}/{deal.targetQty} ({progressPct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(progressPct, 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        onClick={() => handlePledge(deal.id)}
                        className={`flex-1 rounded-xl text-xs font-bold py-2 ${
                          isPledged 
                            ? "bg-emerald-700 text-white" 
                            : "bg-[#166534] hover:bg-[#14532D] text-white"
                        }`}
                      >
                        {isPledged ? (
                          <span className="flex items-center gap-1 justify-center">
                            <Check className="w-3.5 h-3.5" />
                            <span>Pledged ({pledged[deal.id]})</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 justify-center">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pledge Unit</span>
                          </span>
                        )}
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0 h-8 w-8"
                      >
                        <Link href={`/app/bulk-deals/${deal.id}`}>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
