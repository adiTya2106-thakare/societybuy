"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Truck, 
  Receipt, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Store,
  Wallet,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MerchantsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    city: "Pune",
    category: "Grains & Flours",
    estimatedSupplyCapacity: "100+ units/week",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FAF5] min-h-screen text-[#17211B] antialiased">
      
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0F3D20] via-[#14532D] to-[#166534] text-white relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-200">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>FOR WHOLESALERS, APMC MERCHANTS & FMCG DISTRIBUTORS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            More Families. Bigger Consignments. <br />
            <span className="text-amber-300">Predictable Wholesale Business.</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Stop losing 30% margin on single-item grocery delivery apps. Supply directly to 100+ households per apartment complex with single-drop logistics and guaranteed pre-paid bulk demand.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Button asChild size="xl" className="bg-[#F59E0B] hover:bg-[#D97706] text-amber-950 font-black rounded-full px-8 text-sm shadow-xl">
              <a href="#partner-form">Apply for Supplier Account</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 sm:py-20 bg-white border-b border-emerald-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Supplier Advantages
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Top Suppliers Partner with SocietyBuy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#F8FAF5] border border-slate-200/90 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1 Society = 1 Bulk Drop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instead of deploying 50 delivery riders across city traffic, your truck makes one consolidated drop at the society gate. Our on-premise staff handles door-to-door distribution.
              </p>
              <div className="text-xs font-bold text-emerald-700">90% reduction in delivery operational cost</div>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FAF5] border border-slate-200/90 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pre-Paid Demand, Zero Returns</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders are pre-committed and pre-authorized before you dispatch inventory. Say goodbye to the 8–12% cash-on-delivery cancellation rate typical of quick commerce.
              </p>
              <div className="text-xs font-bold text-emerald-700">100% assured sell-through on every dispatch</div>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FAF5] border border-slate-200/90 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">T+1 Direct Bank Payouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated settlements straight into your business current account within 24 hours of society delivery confirmation. No delayed 45-day supermarket credit terms.
              </p>
              <div className="text-xs font-bold text-emerald-700">Fast liquid working capital rotation</div>
            </div>

          </div>

        </div>
      </section>

      {/* Onboarding Form */}
      <section id="partner-form" className="py-16 sm:py-24 bg-[#F8FAF5]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-white border border-emerald-900/10 p-8 sm:p-12 shadow-xl">
            
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Partner Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Register as a SocietyBuy Supplier
              </h2>
              <p className="text-xs text-slate-500">
                Fill this 1-minute form. Our Merchant Operations Lead will contact you within 4 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-950">Application Received Successfully!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{formData.contactPerson}</strong> ({formData.businessName}). We have assigned your profile to the <strong>{formData.city}</strong> Regional Supply Lead. You will receive a call shortly to schedule your first bulk society pilot.
                </p>
                <div className="pt-2">
                  <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="rounded-full text-xs">
                    Submit Another Application
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Business / Firm Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mahalakshmi Agro Traders"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Contact Person Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Rajesh Patil"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">WhatsApp / Mobile Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">City / Operating Market *</label>
                    <select 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="Pune">Pune (APMC Market Yard & Pimpri)</option>
                      <option value="Bengaluru">Bengaluru (Yeshwanthpur & APMC)</option>
                      <option value="Mumbai">Mumbai / Navi Mumbai (Vashi APMC)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Primary Product Category *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="Grains & Flours">Atta, Rice & Grains</option>
                      <option value="Cooking Oils & Ghee">Cooking Oils & Ghee</option>
                      <option value="Pulses & Dals">Pulses & Dals (Tata, Loose APMC)</option>
                      <option value="Fresh Farm Produce">Fresh Vegetables & Fruits (Direct Orchard/Mandi)</option>
                      <option value="Household Detergents">Household Detergents & Cleaning</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Weekly Supply Capacity *</label>
                    <select 
                      value={formData.estimatedSupplyCapacity}
                      onChange={(e) => setFormData({ ...formData, estimatedSupplyCapacity: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="50-100 units/week">50 – 100 bags/units weekly</option>
                      <option value="100-500 units/week">100 – 500 bags/units weekly</option>
                      <option value="500+ units/week">500+ units weekly (Truckload Capacity)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs py-3.5 shadow-md">
                    Submit Supplier Partnership Application
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>GSTIN verified onboarding • Zero upfront listing fees</span>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
