import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  TrendingDown, 
  Truck, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Receipt, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="bg-[#F8FAF5] min-h-screen text-[#17211B] antialiased">
      
      {/* Header Banner */}
      <section className="py-16 lg:py-24 border-b border-emerald-900/10 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>COMMUNITY PURCHASING ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How SocietyBuy Works
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Individual orders. Pooled community volume. Direct wholesale savings. Here is the complete journey from your phone to your flat doorstep.
          </p>
        </div>
      </section>

      {/* 4 Pillars In-Depth */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 card-shadow">
            <div className="md:col-span-5 relative h-60 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center p-6">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" 
                alt="Select Groceries" 
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute top-3 left-3 bg-[#166534] text-white text-xs font-black px-3 py-1 rounded-full shadow">
                STEP 01
              </span>
            </div>
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Household Autonomy</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Shop What Your Family Needs</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You never have to coordinate manually with neighbours or buy items you don't want. Simply browse your apartment's active catalog and pick your household pack size — whether it's 5kg atta, 1 litre mustard oil, or a crate of seasonal mangoes.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No minimum order pressure on single families</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified top FMCG brands and direct APMC mandi produce</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 card-shadow">
            <div className="md:col-span-7 space-y-3 order-2 md:order-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Algorithmic Consolidation</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Society Pools Demand In Real Time</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When you tap "Commit to Deal", your order quantity is added to your society's live pooling progress bar. As more families from Tower A, B, and C join during the 48-hour window, the target threshold approaches completion.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live progress updates on your resident dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp & SMS alerts when deal qualifies or nears deadline</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-5 relative h-60 rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 flex items-center justify-center p-6 order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80" 
                alt="Demand Pooling" 
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute top-3 left-3 bg-[#F59E0B] text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow">
                STEP 02
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 card-shadow">
            <div className="md:col-span-5 relative h-60 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center p-6">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" 
                alt="Wholesale Tier" 
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                STEP 03
              </span>
            </div>
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Direct Wholesaler Pricing</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Wholesale Discount Unlocks for Everyone</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The moment your society passes the required minimum (e.g. 50 units), the wholesale price automatically locks in for every participating flat. Suppliers dispatch pre-packed consignments directly from wholesale stockpoints.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Saves up to 35% compared to local supermarkets and quick commerce</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero middleman markups: you buy at distributor rates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 card-shadow">
            <div className="md:col-span-7 space-y-3 order-2 md:order-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Doorstep Delivery & Individual Invoicing</span>
              <h2 className="text-2xl font-extrabold text-slate-900">Separate Bills. Direct Flat Delivery.</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The delivery truck arrives at your society delivery station. Our verified delivery team tags each flat's items with personalized barcode stickers and delivers directly to your door or clubhouse pickup point.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Individual GST bill generated in your name</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep delivery slot confirmed with security gate pass</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-5 relative h-60 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center p-6 order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=600&q=80" 
                alt="Doorstep Drop" 
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute top-3 left-3 bg-slate-800 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                STEP 04
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-16 bg-[#166534] text-white text-center">
        <div className="mx-auto max-w-4xl px-4 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Experience Community Savings?</h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Join Greenfield Heights or find your residential complex on SocietyBuy today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-amber-950 font-black rounded-full px-8 text-xs">
              <Link href="/register">Join Your Society</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-emerald-800 rounded-full px-8 text-xs font-bold">
              <Link href="/app/shop">Explore Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
