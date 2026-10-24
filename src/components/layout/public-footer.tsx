import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin, ShieldCheck, HeartHandshake, Truck, Award, Sparkles } from "lucide-react";

const footerLinks = {
  "Community Shopping": [
    { href: "/app/shop", label: "Browse Grocery Catalog" },
    { href: "/app/bulk-deals", label: "Active Society Pools" },
    { href: "/how-it-works", label: "How Flat Pooling Works" },
    { href: "/#savings-calculator", label: "Society Savings Calculator" },
  ],
  "Partnerships": [
    { href: "/merchants", label: "Become a Merchant Partner" },
    { href: "/merchants#onboarding", label: "Supplier Guidelines" },
    { href: "/register?role=society_admin", label: "Register Your Apartment Society" },
    { href: "/delivery", label: "Delivery Partner Network" },
  ],
  "Trust & Legal": [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refund-policy", label: "Cancellation & Refund Policy" },
    { href: "/contact", label: "Customer & Resident Support" },
  ],
};

export function PublicFooter() {
  return (
    <footer className="border-t border-emerald-950/20 bg-[#0F291E] text-slate-300">
      {/* Top Value Bar */}
      <div className="border-b border-emerald-800/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Direct Bulk Pricing</h4>
              <p className="text-xs text-slate-400">Unlock wholesale tiers by pooling apartment demand.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Society Hub Delivery</h4>
              <p className="text-xs text-slate-400">Single consolidated drop to your tower lobby or door.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Individual Flat Invoices</h4>
              <p className="text-xs text-slate-400">Every household pays separately with their own bill.</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Freshness Guarantee</h4>
              <p className="text-xs text-slate-400">Verified local APMC & direct brand suppliers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-black shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Society<span className="text-emerald-400">Buy</span>
              </span>
            </Link>
            
            <p className="mt-4 text-xs leading-relaxed text-slate-400 max-w-sm">
              SocietyBuy revolutionizes residential shopping by combining demand across 100+ flats in your apartment complex. Buy together, unlock wholesale supplier prices, and enjoy effortless doorstep delivery.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                <Sparkles className="w-3 h-3 text-amber-300" /> Active in 85+ Societies
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                Pune • Bengaluru • Mumbai
              </span>
            </div>

            <div className="mt-5 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                <span>support@societybuy.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>+91 98200 12345 (9 AM – 9 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>Tech Park Annex, Baner, Pune, MH 411045</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">{category}</h3>
              <ul className="space-y-2 text-xs">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-emerald-400 transition-colors inline-block py-0.5"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SocietyBuy Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-3">
            <span>Made with pride for Indian apartment communities</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Buy Together. Save Together.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
