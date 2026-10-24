"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ShoppingCart, 
  ChevronDown, 
  Users, 
  ShieldCheck,
  Building2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [societyModalOpen, setSocietyModalOpen] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState("Greenfield Heights, Tower B");
  const { data: session } = useSession();

  const societies = [
    { name: "Greenfield Heights, Tower B", flats: 120, deals: 8, active: true },
    { name: "Prestige Silver Oak, Phase 1", flats: 250, deals: 14, active: false },
    { name: "Sobha Dream Acres, Wing C", flats: 310, deals: 19, active: false },
    { name: "Godrej Woodsman Estate", flats: 180, deals: 11, active: false },
  ];

  return (
    <>
      {/* Top Society Notice Banner */}
      <div className="bg-[#14532D] text-emerald-100 text-xs py-1.5 px-4">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" /> COMMUNITY POWERED
            </span>
            <span>Flat A-101 to D-804: Combine demand for daily essentials & save up to 35% together.</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-emerald-200/90 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Society Delivery
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> 1,400+ Active Households
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Logo & Society Selector */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#166534] to-[#14532D] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#17211B] flex items-center gap-1">
                  Society<span className="text-[#166534]">Buy</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase -mt-1">
                  Buy Together • Save Together
                </span>
              </div>
            </Link>

            {/* Society Pill / Dropdown trigger */}
            <button
              onClick={() => setSocietyModalOpen(!societyModalOpen)}
              className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 hover:bg-emerald-100/70 px-3.5 py-1.5 text-xs font-medium text-emerald-900 transition-colors shadow-sm"
              title="Change Delivery Society"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-700" />
              <span className="max-w-[170px] truncate">{selectedSociety}</span>
              <ChevronDown className="h-3 w-3 text-emerald-600" />
            </button>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search atta, dal, oil, fresh veggies across active society pools..."
                className="w-full rounded-full border border-slate-200/90 bg-slate-50/80 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/app/shop"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              Shop Essentials
            </Link>

            <Link
              href="/app/bulk-deals"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors flex items-center gap-1.5 relative group"
            >
              <span>Bulk Deals</span>
              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 font-bold px-2 py-0.5 text-[10px] animate-soft-pulse border border-amber-300">
                Live
              </span>
            </Link>

            <Link
              href="/how-it-works"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              How It Works
            </Link>

            <Link
              href="/merchants"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              For Merchants
            </Link>
          </nav>

          {/* Right Action Icons: Cart & Auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/app/cart"
              className="relative p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="View Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#166534] text-[10px] font-bold text-white shadow">
                2
              </span>
            </Link>

            {session ? (
              <Button asChild size="sm" className="bg-[#166534] hover:bg-[#14532D] text-white rounded-full px-4 text-xs font-semibold shadow-sm">
                <Link href="/app">My Flat Portal</Link>
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 rounded-full px-3.5">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#166534] hover:bg-[#14532D] text-white rounded-full px-4 text-xs font-semibold shadow-sm shadow-emerald-900/10">
                  <Link href="/register">Join Society</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="border-t border-slate-200/80 bg-white px-4 py-4 lg:hidden shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="mb-3">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-900">
                <Building2 className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">Society:</span>
                <span className="truncate">{selectedSociety}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/app/shop"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <span>Shop Essentials</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/app/bulk-deals"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>Bulk Deals</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Live Pools
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/how-it-works"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <span>How It Works</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/merchants"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              >
                <span>For Merchants</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 mt-2">
                {!session && (
                  <>
                    <Button asChild variant="outline" className="w-full justify-center rounded-xl text-xs font-semibold">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>Login to Your Flat</Link>
                    </Button>
                    <Button asChild className="w-full justify-center rounded-xl text-xs font-semibold bg-[#166534] hover:bg-[#14532D] text-white">
                      <Link href="/register" onClick={() => setMobileOpen(false)}>Register New Flat</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Society Switcher Modal */}
      {societyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Select Your Society</h3>
                  <p className="text-xs text-slate-500">Deals and delivery slots are linked to your apartment complex.</p>
                </div>
              </div>
              <button 
                onClick={() => setSocietyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 my-4 max-h-60 overflow-y-auto">
              {societies.map((soc) => (
                <button
                  key={soc.name}
                  onClick={() => {
                    setSelectedSociety(soc.name);
                    setSocietyModalOpen(false);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    selectedSociety === soc.name 
                      ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                      : "border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{soc.name}</p>
                    <p className="text-xs text-slate-500">{soc.flats} Participating Flats • {soc.deals} Active Deals</p>
                  </div>
                  {selectedSociety === soc.name && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Don't see your society?{" "}
                <Link href="/register" onClick={() => setSocietyModalOpen(false)} className="text-emerald-700 font-semibold hover:underline">
                  Nominate your apartment committee
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
