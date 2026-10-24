import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/bulk-deals", label: "Bulk Deals" },
    { href: "/app/shop", label: "Shop" },
    { href: "/merchants", label: "For Merchants" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/careers", label: "Careers" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/refund-policy", label: "Refund Policy" },
  ],
};

export function PublicFooter() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-green-700">
              <ShoppingBag className="h-7 w-7" />
              <span>SocietyBuy</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              Buy Together. Save Together. Community-powered bulk shopping for residential societies across India.
            </p>
            <div className="mt-4 flex flex-col gap-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> hello@societybuy.in
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 98000 00000
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Pune, Maharashtra, India
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-green-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SocietyBuy. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Made with ❤ for Indian residential communities
          </p>
        </div>
      </div>
    </footer>
  );
}
