import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingBag,
  Users,
  TrendingDown,
  Truck,
  Star,
  CheckCircle,
  ArrowRight,
  Package,
  Wheat,
  Droplets,
  Leaf,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const categories = [
  { name: "Grains & Flour", icon: Wheat, color: "bg-amber-100 text-amber-700", count: "45+ products" },
  { name: "Cooking Oil", icon: Droplets, color: "bg-yellow-100 text-yellow-700", count: "18+ products" },
  { name: "Pulses & Dals", icon: Package, color: "bg-orange-100 text-orange-700", count: "32+ products" },
  { name: "Fresh Vegetables", icon: Leaf, color: "bg-green-100 text-green-700", count: "60+ products" },
  { name: "Dairy & Eggs", icon: Package, color: "bg-blue-100 text-blue-700", count: "24+ products" },
  { name: "Cleaning & Care", icon: ShoppingBag, color: "bg-purple-100 text-purple-700", count: "38+ products" },
];

const steps = [
  {
    step: "1",
    title: "Join Your Society",
    desc: "Register and join your residential society on SocietyBuy. It's free.",
    icon: Users,
  },
  {
    step: "2",
    title: "Browse & Commit",
    desc: "Browse products and commit your quantity to active bulk deals in your society.",
    icon: ShoppingBag,
  },
  {
    step: "3",
    title: "Deal Qualifies",
    desc: "When combined demand meets the minimum, the deal qualifies at the bulk price.",
    icon: TrendingDown,
  },
  {
    step: "4",
    title: "Get Delivered",
    desc: "Your order is delivered to your flat or a society pickup point of your choice.",
    icon: Truck,
  },
];

const faqs = [
  {
    q: "What if the deal doesn't reach the minimum quantity?",
    a: "If a deal fails to meet its minimum, all commitments are cancelled and no payment is charged. We notify everyone immediately.",
  },
  {
    q: "Can I cancel my commitment?",
    a: "Yes, you can cancel your commitment before the deal reaches its minimum quantity and enters fulfillment. The cancellation policy is shown clearly on each deal.",
  },
  {
    q: "How are prices verified?",
    a: "All prices are set by verified, onboarded merchants. We display the market MRP and show you the actual bulk price — no inflated MRPs.",
  },
  {
    q: "Who delivers my order?",
    a: "Orders are delivered by our network of verified delivery partners, or you can choose a society pickup point.",
  },
  {
    q: "Is my payment safe?",
    a: "All payments are processed through a PCI-DSS compliant payment gateway. We never store your card details.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b py-4">
      <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium list-none">
        {q}
        <span className="ml-auto shrink-0">
          <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
    </details>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Badge variant="success" className="mb-4 text-sm px-4 py-1.5">
            🎉 Now available in 50+ residential societies
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Buy Together.{" "}
            <span className="text-green-600">Save Together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            SocietyBuy combines the purchasing power of your entire residential society to unlock bulk prices from local suppliers — while every family gets their own order, invoice, and delivery.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="xl">
              <Link href="/register">
                Start Saving Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            {[
              ["50+", "Societies"],
              ["5,000+", "Families"],
              ["₹2Cr+", "Saved"],
              ["200+", "Products"],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{num}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live deal example */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            See a Live Bulk Deal in Action
          </h2>
          <p className="mt-2 text-center text-gray-500">
            This is how your society can unlock better prices together
          </p>
          <Card className="mt-8 overflow-hidden border-2 border-green-100">
            <div className="bg-green-600 px-6 py-3 text-white">
              <span className="text-sm font-semibold">🔥 ACTIVE DEAL — 2 days left</span>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Aashirvaad Whole Wheat Atta 10kg</h3>
                  <p className="text-sm text-gray-500 mt-1">Greenfield Traders • Sunrise Apartments</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-green-600">₹320</p>
                  <p className="text-xs text-gray-400 line-through">MRP ₹395</p>
                  <Badge variant="success" className="mt-1">Save 19%</Badge>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Community demand: <strong>270 kg</strong> of 300 kg target</span>
                  <span className="text-green-600 font-semibold">90%</span>
                </div>
                <Progress value={90} className="h-3" />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>Min. 150 kg to qualify ✓ <CheckCircle className="inline h-3 w-3 text-green-500" /></span>
                  <span>30 kg remaining</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["27", "Flats joined"],
                  ["₹75", "Avg. saving/family"],
                  ["₹2,025", "Society total saved"],
                ].map(([val, label]) => (
                  <div key={label} className="rounded-lg bg-green-50 p-3">
                    <p className="text-lg font-bold text-green-700">{val}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/register">Join This Deal</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6" id="how-it-works">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How SocietyBuy Works
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Four simple steps to start saving on everyday essentials
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-xl bg-white border p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <item.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="mb-2 text-xs font-bold text-green-600">STEP {item.step}</div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Popular Categories
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/app/shop?category=${cat.name.toLowerCase().replace(/ & /g, "-")}`}
                className="group flex flex-col items-center rounded-xl border p-4 text-center transition-all hover:border-green-300 hover:shadow-md"
              >
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${cat.color}`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-green-700">{cat.name}</p>
                <p className="mt-0.5 text-xs text-gray-400">{cat.count}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/app/shop">Browse All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Merchant benefits */}
      <section className="bg-green-600 px-4 py-16 sm:px-6 text-white">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Are You a Local Merchant or Supplier?
            </h2>
            <p className="mt-4 text-green-100">
              Partner with SocietyBuy to reach thousands of families across residential societies. Get consolidated bulk orders, guaranteed demand visibility, and streamlined payments.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Receive consolidated bulk orders from entire societies",
                "No upfront fees — only a small commission on completed orders",
                "Real-time demand data before you commit inventory",
                "Automated invoicing and settlement dashboard",
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-300" />
                  {benefit}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 text-green-700 border-white bg-white hover:bg-green-50">
              <Link href="/merchants">Partner With Us</Link>
            </Button>
          </div>
          <div className="rounded-2xl bg-green-700 p-8 text-center">
            <p className="text-4xl font-extrabold">₹0</p>
            <p className="mt-2 text-green-200">Upfront joining cost</p>
            <div className="mt-6 space-y-3 text-sm text-left">
              {[
                "Free merchant registration",
                "Free product listing",
                "Pay commission only on completed orders",
                "Dedicated support from day one",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to Start Saving?</h2>
        <p className="mt-3 text-green-100">
          Join thousands of families already saving on daily essentials through community buying.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="xl" className="bg-white text-green-700 hover:bg-green-50">
            <Link href="/register">Join Your Society</Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-white text-white hover:bg-green-700">
            <Link href="/bulk-deals">View Active Deals</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
