"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  ShoppingBag,
  TrendingDown,
  ShoppingCart,
  Package,
  List,
  PiggyBank,
  MapPin,
  User,
  HelpCircle,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/app", label: "Dashboard", icon: Home, exact: true },
  { href: "/app/shop", label: "Shop", icon: ShoppingBag },
  { href: "/app/bulk-deals", label: "Bulk Deals", icon: TrendingDown },
  { href: "/app/cart", label: "Cart", icon: ShoppingCart },
  { href: "/app/orders", label: "Orders", icon: Package },
  { href: "/app/lists", label: "My Lists", icon: List },
  { href: "/app/savings", label: "Savings", icon: PiggyBank },
  { href: "/app/addresses", label: "Addresses", icon: MapPin },
  { href: "/app/profile", label: "Profile", icon: User },
  { href: "/app/support", label: "Support", icon: HelpCircle },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-base">SocietyBuy</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-0.5 px-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-white lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700">
          <ShoppingBag className="h-5 w-5" />
          SocietyBuy
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/app/notifications">
            <Bell className="h-5 w-5 text-gray-500" />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed left-0 top-14 bottom-0 w-72 bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Spacer for mobile top bar */}
      <div className="h-14 lg:hidden" />
    </>
  );
}
