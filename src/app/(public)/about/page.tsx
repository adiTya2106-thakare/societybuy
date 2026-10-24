import Link from "next/link";
import { Building2, Heart, ShieldCheck, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAF5] min-h-screen text-[#17211B] antialiased">
      
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-white border-b border-emerald-900/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>OUR MISSION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Rewiring Grocery Commerce Around <br />
            <span className="text-[#166534]">Residential Communities</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In modern urban apartments, 200 families live under one roof, yet buy everyday groceries from separate delivery bikes burning fuel and paying heavy retail markups. We built SocietyBuy to change that.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 card-shadow space-y-6 text-sm text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Why We Started SocietyBuy
            </h2>

            <p>
              The average Indian apartment household spends ₹8,000 to ₹18,000 every month on kitchen essentials — wheat, rice, cooking oils, pulses, cleaning supplies, and vegetables.
            </p>

            <p>
              In quick commerce and retail supermarkets, up to <strong>35% of the sticker price</strong> goes into hyper-local dark store rents, marketing ad-spend, and endless motorbike logistics. Wholesalers and farmers who produce the food make thin margins, while residents pay retail MRPs.
            </p>

            <p>
              By grouping orders at the apartment complex level, SocietyBuy turns an apartment society into a high-volume collective buyer. Suppliers drop full pallets in scheduled windows, and every household saves thousands of rupees every month.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-2xl font-black text-[#166534]">₹28,500</span>
                <p className="text-xs text-slate-600 font-medium mt-1">Avg annual flat savings</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-2xl font-black text-amber-900">85+</span>
                <p className="text-xs text-slate-600 font-medium mt-1">Active societies in Pune & BLR</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-2xl font-black text-blue-900">90%</span>
                <p className="text-xs text-slate-600 font-medium mt-1">Reduction in society delivery traffic</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
