import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="flex justify-center pt-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-green-700">
          <ShoppingBag className="h-7 w-7" />
          <span>SocietyBuy</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <footer className="py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SocietyBuy — Buy Together. Save Together.
      </footer>
    </div>
  );
}
