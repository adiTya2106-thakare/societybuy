"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Users, 
  TrendingDown, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Calculator, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Check, 
  Star,
  Receipt,
  HeartHandshake,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Deal {
  id: string;
  name: string;
  category: string;
  packSize: string;
  regularPrice: number;
  bulkPrice: number;
  committedQty: number;
  targetQty: number;
  timeLeft: string;
  society: string;
  image: string;
  contributors: string[];
}

const initialDeals: Deal[] = [
  {
    id: "d1",
    name: "Aashirvaad Superior MP Atta",
    category: "Flour & Grains",
    packSize: "10 kg bag",
    regularPrice: 460,
    bulkPrice: 375,
    committedQty: 68,
    targetQty: 80,
    timeLeft: "5 hrs 20m",
    society: "Greenfield Heights (Tower A & B)",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat A-102", "Flat B-304", "Flat A-501", "+32 others"],
  },
  {
    id: "d2",
    name: "Fortune Sunlite Refined Sunflower Oil",
    category: "Cooking Oils",
    packSize: "5 Litre Jerry Can",
    regularPrice: 720,
    bulkPrice: 580,
    committedQty: 42,
    targetQty: 50,
    timeLeft: "8 hrs 15m",
    society: "Greenfield Heights (All Wings)",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat C-104", "Flat D-702", "Flat B-201", "+21 others"],
  },
  {
    id: "d3",
    name: "Tata Sampann Unpolished Toor Dal",
    category: "Pulses & Dals",
    packSize: "2 kg pack",
    regularPrice: 340,
    bulkPrice: 275,
    committedQty: 54,
    targetQty: 60,
    timeLeft: "3 hrs 45m",
    society: "Greenfield Heights (Tower B)",
    image: "https://images.unsplash.com/photo-1585994192701-f1a505c8574a?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat A-203", "Flat B-105", "+28 others"],
  },
  {
    id: "d4",
    name: "Farm-Fresh Nashik Red Onions",
    category: "Fresh Farm",
    packSize: "10 kg mesh sack",
    regularPrice: 350,
    bulkPrice: 240,
    committedQty: 92,
    targetQty: 100,
    timeLeft: "2 hrs 10m",
    society: "Greenfield Heights (Direct APMC Drop)",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat D-302", "Flat A-402", "Flat C-505", "+48 others"],
  },
  {
    id: "d5",
    name: "Surf Excel Matic Top Load Detergent",
    category: "Cleaning & Care",
    packSize: "4 kg + 2 kg Free",
    regularPrice: 950,
    bulkPrice: 760,
    committedQty: 29,
    targetQty: 40,
    timeLeft: "11 hrs",
    society: "Greenfield Heights (Clubhouse Drop)",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat B-402", "Flat C-201", "+14 others"],
  },
  {
    id: "d6",
    name: "Devgad Alphonso Mangoes (GI Tagged)",
    category: "Fresh Farm",
    packSize: "1 Dozen Box (Grade A)",
    regularPrice: 1200,
    bulkPrice: 890,
    committedQty: 48,
    targetQty: 50,
    timeLeft: "1 hr 30m",
    society: "Greenfield Heights (Orchard Direct)",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    contributors: ["Flat A-601", "Flat B-504", "+36 others"],
  },
];

const categories = [
  { name: "Atta, Rice & Grains", count: "48 items", icon: "🌾", color: "from-amber-500/10 to-amber-600/5", border: "border-amber-200" },
  { name: "Cooking Oil & Ghee", count: "24 items", icon: "🫒", color: "from-yellow-500/10 to-yellow-600/5", border: "border-yellow-200" },
  { name: "Pulses & Dals", count: "36 items", icon: "🥣", color: "from-orange-500/10 to-orange-600/5", border: "border-orange-200" },
  { name: "Fresh Farm Produce", count: "65 items", icon: "🥦", color: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-200" },
  { name: "Dairy, Paneer & Eggs", count: "28 items", icon: "🥛", color: "from-blue-500/10 to-blue-600/5", border: "border-blue-200" },
  { name: "Cleaning & Hygiene", count: "42 items", icon: "🧼", color: "from-purple-500/10 to-purple-600/5", border: "border-purple-200" },
  { name: "Snacks, Tea & Coffee", count: "55 items", icon: "☕", color: "from-rose-500/10 to-rose-600/5", border: "border-rose-200" },
  { name: "Spices & Dry Fruits", count: "32 items", icon: "🌰", color: "from-teal-500/10 to-teal-600/5", border: "border-teal-200" },
];

const faqs = [
  {
    q: "How does flat pooling work if my neighbours order at different times?",
    a: "Every week, our algorithm opens designated 48-hour society purchasing windows for staples (atta, oil, dal, potatoes, etc.). Families place their individual quantity whenever convenient. When the collective demand hits the supplier tier (e.g., 50 bags), wholesale pricing unlocks for every single flat.",
  },
  {
    q: "Do I have to collect money from my neighbours or pay together?",
    a: "Never. That's the core innovation of SocietyBuy! Every flat gets its own separate checkout, pays with their own UPI/Card, and receives their own itemized GST invoice.",
  },
  {
    q: "What happens if a deal doesn't hit the minimum quota?",
    a: "If a deal does not qualify by the deadline, you have zero penalty. You can either purchase at the verified individual market price or cancel with a 100% instant refund back to your payment source.",
  },
  {
    q: "Where is the delivery made?",
    a: "Suppliers make one consolidated drop at your apartment society gate or clubhouse delivery station. Our dedicated society delivery partner then delivers each sealed, labelled bag directly to your flat doorstep.",
  },
  {
    q: "How can our apartment society or RWA get onboarded?",
    a: "Any resident or Managing Committee member can register their society in 2 minutes. We assign a dedicated Society Care Coordinator who maps your apartment towers and coordinates delivery with security.",
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All Deals");
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [joinedDeals, setJoinedDeals] = useState<{ [id: string]: number }>({});
  
  // Interactive Calculator State
  const [flatsCount, setFlatsCount] = useState<number>(100);
  const [monthlySpend, setMonthlySpend] = useState<number>(6500);
  const [discountPercent, setDiscountPercent] = useState<number>(22);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculator math
  const perHouseholdMonthlySavings = Math.round((monthlySpend * discountPercent) / 100);
  const perHouseholdAnnualSavings = perHouseholdMonthlySavings * 12;
  const totalSocietyMonthlySavings = perHouseholdMonthlySavings * flatsCount;

  // Filter deals
  const filteredDeals = selectedCategory === "All Deals"
    ? deals
    : deals.filter((d) => d.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(d.category.toLowerCase()));

  // Interactive join deal simulation
  const handleJoinDeal = (dealId: string) => {
    setJoinedDeals((prev) => {
      const current = prev[dealId] || 0;
      const next = current + 1;
      return { ...prev, [dealId]: next };
    });

    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const newQty = Math.min(d.committedQty + 1, d.targetQty);
          return { ...d, committedQty: newQty };
        }
        return d;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAF5] text-[#17211B] antialiased selection:bg-emerald-200">
      
      {/* ─── 1. HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-900/10">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-100/70 via-emerald-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 border border-emerald-300/60 px-3.5 py-1 text-xs font-semibold text-emerald-900 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold tracking-wide">COMMUNITY BUYING FOR APARTMENTS</span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-700 font-medium">Pune & Bengaluru</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#17211B] leading-[1.12]">
                Your Society. <br />
                <span className="text-[#166534] relative inline-block">
                  One Collective Cart.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0, 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span> <br />
                Smarter Grocery Prices.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                When Flat A-101 needs 5kg atta, and Flat B-204 needs 10kg — SocietyBuy combines demand across your entire apartment tower. Unlock authentic wholesale rates, separate individual flat billing, and zero delivery fee.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                <Button 
                  asChild 
                  size="xl" 
                  className="bg-[#166534] hover:bg-[#14532D] text-white rounded-full px-8 font-bold shadow-lg shadow-emerald-900/15 group transition-all"
                >
                  <Link href="#live-deals" className="flex items-center gap-2">
                    <span>Explore Society Deals</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  size="xl" 
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-full px-7 font-bold shadow-sm"
                >
                  <Link href="/app/shop">
                    Individual Catalog
                  </Link>
                </Button>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Separate Invoices</span>
                    <p className="text-[11px] text-slate-400">Zero money collection headache</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Direct Doorstep Drop</span>
                    <p className="text-[11px] text-slate-400">Consolidated society logistics</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">100% Brand Certified</span>
                    <p className="text-[11px] text-slate-400">Direct from factory & APMC</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Hero: Interactive Live Community Deal Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Background ambient card */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 blur-xl opacity-70 -z-10" />

              <div className="rounded-3xl bg-white p-6 shadow-2xl border border-emerald-100/80 relative">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                      Live Society Pool #418
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-amber-600" /> Closes in 4h 18m
                  </span>
                </div>

                {/* Society Location */}
                <div className="py-3 flex items-center gap-2 text-xs font-medium text-emerald-800">
                  <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Greenfield Heights — Towers A, B & C</span>
                </div>

                {/* Product Detail Preview */}
                <div className="flex items-center gap-4 py-2">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80" 
                      alt="Aashirvaad Atta" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">Wheat & Flour</span>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">
                      Aashirvaad Superior MP Sharbati Atta
                    </h3>
                    <p className="text-xs text-slate-500">10 kg Family Pack • 100% Whole Wheat</p>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-amber-50/40 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block line-through">Standard Retail MRP: ₹460</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-[#166534]">₹375</span>
                      <span className="text-xs font-medium text-slate-500">/ bag</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-[#F59E0B] text-amber-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                      SAVE ₹85 (19%)
                    </span>
                    <span className="text-[11px] text-emerald-700 block font-semibold mt-1">Wholesale Tier Unlocked</span>
                  </div>
                </div>

                {/* Progress Bar of Collective Demand */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Collective Demand: 68 / 80 Bags</span>
                    <span className="text-emerald-700 font-bold">85% Filled</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500" 
                      style={{ width: "85%" }} 
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Just <strong>12 more bags</strong> needed from your society to confirm wholesale dispatch!</span>
                  </p>
                </div>

                {/* Contributor Flat Avatars */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">A1</div>
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">B3</div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">C5</div>
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold border-2 border-white">+31</div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">34 flats pledged</span>
                </div>

                {/* Interactive Action inside Hero Card */}
                <div className="mt-4">
                  <Button 
                    onClick={() => handleJoinDeal("d1")}
                    className="w-full bg-[#166534] hover:bg-[#14532D] text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
                  >
                    {joinedDeals["d1"] ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Pledged ({joinedDeals["d1"]} Bag{joinedDeals["d1"] > 1 ? "s" : ""}) — Add Another</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Pledge 1 Bag for Flat (Save ₹85)</span>
                      </>
                    )}
                  </Button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. HOW COMMUNITY BUYING WORKS ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              The SocietyBuy Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211B] tracking-tight">
              Buy Together. Save Together.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              How 100 apartment households unlock direct wholesale rates without any group admin hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative p-6 rounded-3xl bg-[#F8FAF5] border border-emerald-900/10 flex flex-col items-start card-shadow-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#166534] text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Select Your Essentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose the brand staples your family regularly needs — atta, rice, oil, pulses, and farm vegetables.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 w-full text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <span>Individual household choices</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-3xl bg-[#F8FAF5] border border-emerald-900/10 flex flex-col items-start card-shadow-hover">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pool Society Demand</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your order is automatically pooled with orders from neighbours in your apartment complex over a 48-hour window.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 w-full text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <span>Tower-level demand aggregation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-3xl bg-[#F8FAF5] border border-emerald-900/10 flex flex-col items-start card-shadow-hover">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] text-amber-950 flex items-center justify-center font-black text-lg mb-4 shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Wholesale Tier Unlocks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as the society quota is crossed, bulk supplier pricing applies to everyone. You save up to 35%.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 w-full text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                <span>Transparent tiered discounts</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-3xl bg-[#F8FAF5] border border-emerald-900/10 flex flex-col items-start card-shadow-hover">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Doorstep Flat Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One single consolidated drop arrives at your society. Each flat receives its own labelled package and individual bill.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 w-full text-[11px] font-semibold text-slate-800 flex items-center gap-1">
                <span>Separate flat billing & tracking</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. SIGNATURE LIVE BULK DEALS SECTION ─────────────────────────────────── */}
      <section id="live-deals" className="py-16 sm:py-24 bg-[#F8FAF5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded-md bg-red-100 text-red-600">
                  <Flame className="w-4 h-4 fill-red-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Active Society Buying Windows
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211B] tracking-tight">
                Your Neighbours Are Shopping. Join the Savings.
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Pool with families in your society. Pledging is risk-free: individual billing, verified savings, and guaranteed doorstep delivery.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {["All Deals", "Flour & Grains", "Cooking Oils", "Pulses & Dals", "Fresh Farm", "Cleaning & Care"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#166534] text-white shadow-md shadow-emerald-900/10"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDeals.map((deal) => {
              const savings = deal.regularPrice - deal.bulkPrice;
              const savingsPercent = Math.round((savings / deal.regularPrice) * 100);
              const progressPercent = Math.round((deal.committedQty / deal.targetQty) * 100);
              const isJoined = joinedDeals[deal.id] && joinedDeals[deal.id] > 0;

              return (
                <div 
                  key={deal.id}
                  className="rounded-3xl bg-white border border-emerald-900/10 overflow-hidden card-shadow-hover flex flex-col justify-between"
                >
                  {/* Top Image & Badge */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden group">
                    <img 
                      src={deal.image} 
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Top Savings Pill */}
                    <div className="absolute top-3 left-3 bg-[#F59E0B] text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                      SAVE ₹{savings} ({savingsPercent}%)
                    </div>

                    {/* Time Left Pill */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{deal.timeLeft}</span>
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {deal.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-emerald-800 font-semibold mb-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{deal.society}</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1">
                        {deal.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{deal.packSize}</p>

                      {/* Pricing Matrix */}
                      <div className="mt-3 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 line-through">MRP: ₹{deal.regularPrice}</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-[#166534]">₹{deal.bulkPrice}</span>
                            <span className="text-[11px] font-medium text-slate-500">/ unit</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Direct APMC Rate
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Society Quota: {deal.committedQty} / {deal.targetQty} pledged</span>
                          <span className="text-emerald-700">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>{deal.targetQty - deal.committedQty > 0 ? `${deal.targetQty - deal.committedQty} units to unlock` : "Threshold unlocked!"}</span>
                          <span className="text-emerald-700 font-medium">Free Doorstep Drop</span>
                        </div>
                      </div>
                    </div>

                    {/* Join / Pledge Action */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        onClick={() => handleJoinDeal(deal.id)}
                        className={`flex-1 rounded-xl text-xs font-bold py-2.5 transition-all ${
                          isJoined 
                            ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow"
                            : "bg-[#166534] hover:bg-[#14532D] text-white shadow-sm"
                        }`}
                      >
                        {isJoined ? (
                          <span className="flex items-center gap-1.5 justify-center">
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Pledged ({joinedDeals[deal.id]}) • Add More</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 justify-center">
                            <Plus className="w-4 h-4" />
                            <span>Pledge 1 Unit (Save ₹{savings})</span>
                          </span>
                        )}
                      </Button>
                      
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
                        title="View deal specifications & batch details"
                      >
                        <Link href={`/app/bulk-deals/${deal.id}`}>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Deals CTA */}
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-bold border-slate-300 text-slate-800 hover:bg-emerald-50 hover:text-emerald-800">
              <Link href="/app/bulk-deals">
                View All 42 Active Society Deals Across Categories →
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* ─── 4. INTERACTIVE BULK SAVINGS CALCULATOR ───────────────────────────────── */}
      <section id="savings-calculator" className="py-16 sm:py-20 bg-white border-y border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-gradient-to-br from-[#0F3D20] via-[#14532D] to-[#166534] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Sliders */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <Calculator className="w-3.5 h-3.5 text-amber-300" />
                  <span>TRANSPARENT SAVINGS ESTIMATOR</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  How Much Can Your Society Save?
                </h2>
                <p className="text-sm text-emerald-100/80 leading-relaxed max-w-lg">
                  Adjust the sliders according to your apartment complex. When demand is consolidated into weekly truck drops, suppliers pass huge wholesale margin cuts directly to residents.
                </p>

                {/* Slider 1: Number of Flats */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-100">Participating Flats in Society:</span>
                    <span className="text-amber-300 text-sm font-black">{flatsCount} Households</span>
                  </div>
                  <input 
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={flatsCount}
                    onChange={(e) => setFlatsCount(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-emerald-950/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-300/60">
                    <span>20 Flats (Small Society)</span>
                    <span>250 Flats</span>
                    <span>500+ Flats (Gated Enclave)</span>
                  </div>
                </div>

                {/* Slider 2: Average Monthly Grocery Spend per Flat */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-100">Avg Monthly Grocery Spend per Household:</span>
                    <span className="text-amber-300 text-sm font-black">₹{monthlySpend.toLocaleString("en-IN")}</span>
                  </div>
                  <input 
                    type="range"
                    min="2500"
                    max="20000"
                    step="500"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-emerald-950/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-300/60">
                    <span>₹2,500 (Basic Staples)</span>
                    <span>₹10,000</span>
                    <span>₹20,000 (Full Monthly Pantry)</span>
                  </div>
                </div>

                {/* Slider 3: Expected Bulk Discount Percentage */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-100">Negotiated Bulk Discount:</span>
                    <span className="text-amber-300 text-sm font-black">{discountPercent}% Wholesale Margin</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="35"
                    step="1"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full accent-emerald-400 h-2 bg-emerald-950/60 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-emerald-300/60">
                    <span>10% (FMCG Standard)</span>
                    <span>22% (Average SocietyBuy)</span>
                    <span>35% (Direct Farm Crop)</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Computed Numbers Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 space-y-6">
                  
                  <div className="border-b border-white/15 pb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Your Household Savings
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-amber-300">
                        ₹{perHouseholdAnnualSavings.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">/ year</span>
                    </div>
                    <p className="text-xs text-emerald-100/70 mt-1">
                      That is <strong>₹{perHouseholdMonthlySavings.toLocaleString("en-IN")}</strong> saved back in your pocket every month.
                    </p>
                  </div>

                  <div className="border-b border-white/15 pb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Entire Society Savings Pool
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white">
                        ₹{totalSocietyMonthlySavings.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">/ month</span>
                    </div>
                    <p className="text-xs text-emerald-100/70 mt-1">
                      Combined annual community surplus: <strong>₹{((totalSocietyMonthlySavings * 12) / 100000).toFixed(2)} Lakhs</strong>
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-950/40 border border-emerald-400/20 p-3 text-xs text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free society gate consolidation unlocked for <strong>{flatsCount} flats</strong></span>
                  </div>

                  <Button asChild size="lg" className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-amber-950 font-black rounded-xl text-sm shadow-lg">
                    <Link href="/register">
                      Nominate Your Society Today
                    </Link>
                  </Button>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. PRODUCT CATEGORIES GRID ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F8FAF5] border-b border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Pantry Staples
              </span>
              <h2 className="text-3xl font-extrabold text-[#17211B] tracking-tight mt-2">
                Curated Household Essentials
              </h2>
            </div>
            <Link href="/app/shop" className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 group">
              <span>View full catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.name}
                href={`/app/shop?category=${encodeURIComponent(cat.name)}`}
                className={`p-5 rounded-2xl bg-white border ${cat.border} hover:border-emerald-500 card-shadow-hover transition-all flex flex-col justify-between group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Explore active community pools</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. MERCHANT & SUPPLIER PARTNERSHIP ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                For Local Merchants & Distributors
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17211B] tracking-tight">
                More Families. Bigger Orders. <br />
                <span className="text-[#166534]">Better Wholesale Business.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Tired of making 100 individual small bike deliveries across traffic? SocietyBuy aggregates entire apartment complex demand into predictable single-drop wholesale consignments.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Consolidated Single-Drop Logistics</h4>
                    <p className="text-xs text-slate-500">Deliver 80 bags of atta to one society gate instead of 80 separate addresses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pre-Committed Orders with Zero Return Risk</h4>
                    <p className="text-xs text-slate-500">Products are pre-booked and pre-paid before dispatch. No customer cancellations at door.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Next-Day Direct Bank Settlements</h4>
                    <p className="text-xs text-slate-500">Automatic payouts directly to your business current account within 24 hours of delivery.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Button asChild size="lg" className="bg-[#166534] hover:bg-[#14532D] text-white rounded-full px-7 font-bold text-xs shadow-md">
                  <Link href="/merchants">
                    Become a Merchant Partner
                  </Link>
                </Button>
                <Link href="/merchants#faq" className="text-xs font-semibold text-slate-600 hover:text-emerald-700">
                  Read merchant onboarding FAQ →
                </Link>
              </div>
            </div>

            {/* Right Comparison Box */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8 card-shadow">
                <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <span>How SocietyBuy Compares for Suppliers</span>
                </h3>

                <div className="space-y-4 text-xs">
                  
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
                    <span className="font-bold text-red-600 block mb-1">Traditional Instant Delivery Apps</span>
                    <ul className="space-y-1 text-slate-500">
                      <li>• 20% to 35% heavy commission cuts on merchant margins</li>
                      <li>• Unpredictable single-item delivery runs across the city</li>
                      <li>• High customer return & cancellation rate at the doorstep</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">SocietyBuy Partner Network</span>
                    <ul className="space-y-1 text-emerald-800">
                      <li>• Low flat platform fee (keep 94%+ of your wholesale margin)</li>
                      <li>• Scheduled bulk pallet drops (100+ items to 1 location)</li>
                      <li>• Guaranteed pre-paid demand before you pack inventory</li>
                    </ul>
                  </div>

                </div>

                <div className="mt-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Onboarding APMC grain merchants, cooking oil distributors, and FMCG stockists.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. TRUST & FREQUENTLY ASKED QUESTIONS ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F8FAF5] border-b border-emerald-900/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Clear & Transparent
            </span>
            <h2 className="text-3xl font-extrabold text-[#17211B] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about pooled apartment purchases and delivery.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-emerald-800"
                  >
                    <span>{faq.q}</span>
                    <span className="p-1 rounded-lg bg-slate-50 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 8. BOTTOM COMMUNITY INVITE CALLOUT ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#166534] to-[#14532D] text-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-semibold text-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>JOIN 1,400+ APARTMENT FAMILIES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to Cut 25% Off Your Monthly Grocery Expenses?
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto">
            Check if your apartment complex is already active, or register your society in 2 minutes to start collective weekly buying.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button asChild size="xl" className="bg-[#F59E0B] hover:bg-[#D97706] text-amber-950 font-black rounded-full px-8 text-sm shadow-xl">
              <Link href="/register">
                Register Your Flat / Society Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="border-emerald-300/40 text-white hover:bg-emerald-800/40 rounded-full px-8 text-sm font-bold">
              <Link href="/app/shop">
                Explore Product Catalog
              </Link>
            </Button>
          </div>

        </div>
      </section>

    </div>
  );
}
