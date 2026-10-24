"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, MapPin, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";

interface CartData {
  items: Array<{
    id: string;
    qty: number;
    product: {
      name: string;
      merchantProducts: Array<{ basePrice: string; mrp: string }>;
    };
  }>;
  total: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: cartData, isLoading } = useQuery<{ data: CartData }>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
  });

  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [address, setAddress] = useState({
    flatNumber: "",
    building: "",
    societyName: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home",
  });
  const [deliveryType, setDeliveryType] = useState("HOME_DELIVERY");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<{
    gatewayOrderId: string;
    amount: number;
    isDevMode: boolean;
  } | null>(null);

  const cart = cartData?.data;
  const total = (cart?.total ?? 0) + (deliveryType === "HOME_DELIVERY" ? 40 : 0);

  const createOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryType,
          notes: `${address.flatNumber}, ${address.building}, ${address.societyName}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Order failed", description: json.error, variant: "destructive" });
        return;
      }
      setOrderId(json.data.orderId);
      setOrderNumber(json.data.orderNumber);

      // Initiate payment
      const payRes = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: json.data.orderId }),
      });
      const payJson = await payRes.json();
      if (!payRes.ok) {
        toast({ title: "Payment initiation failed", description: payJson.error, variant: "destructive" });
        return;
      }
      setPaymentOrder(payJson.data);
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  const simulatePayment = async (success: boolean) => {
    if (!orderId || !paymentOrder) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          gatewayOrderId: paymentOrder.gatewayOrderId,
          gatewayPaymentId: `sim_pay_${Date.now()}`,
          gatewaySignature: success ? "simulated_success" : "simulated_failure",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Payment failed", description: json.error, variant: "destructive" });
      } else {
        setStep("confirmation");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="h-64 rounded-xl bg-gray-100 animate-pulse" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Button asChild className="mt-4">
          <Link href="/app/shop">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="flex flex-col items-center py-16 text-center space-y-4 max-w-lg mx-auto">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-500">
          Your order <strong>#{orderNumber}</strong> has been placed and payment verified.
          We&apos;re preparing your order.
        </p>
        <div className="flex gap-3 mt-4">
          <Button asChild>
            <Link href={`/app/orders/${orderId}`}>View Order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: address / payment */}
        <div className="lg:col-span-2 space-y-4">
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-green-600" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Flat Number</Label>
                    <Input
                      placeholder="A-101"
                      value={address.flatNumber}
                      onChange={(e) => setAddress({ ...address, flatNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Building</Label>
                    <Input
                      placeholder="Tower B"
                      value={address.building}
                      onChange={(e) => setAddress({ ...address, building: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Society Name</Label>
                  <Input
                    placeholder="Sunrise Apartments"
                    value={address.societyName}
                    onChange={(e) => setAddress({ ...address, societyName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>City</Label>
                    <Input
                      placeholder="Pune"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      placeholder="411001"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Delivery Type</Label>
                  <div className="mt-2 flex gap-3">
                    {["HOME_DELIVERY", "SOCIETY_PICKUP"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setDeliveryType(type)}
                        className={`flex-1 rounded-lg border p-3 text-sm font-medium transition-all ${
                          deliveryType === type
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type === "HOME_DELIVERY" ? "🏠 Home Delivery (₹40)" : "🏢 Society Pickup (Free)"}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={createOrder}
                  loading={loading}
                  className="w-full"
                  disabled={!address.flatNumber || !address.building || !address.city}
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "payment" && paymentOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5 text-green-600" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentOrder.isDevMode && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <p className="font-semibold text-amber-800">Development Mode</p>
                    </div>
                    <p className="text-sm text-amber-700">
                      No real payment is processed. Use the buttons below to simulate payment success or failure.
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Order: <strong>#{orderNumber}</strong></p>
                  <p className="text-sm text-gray-600">Amount: <strong>{formatCurrency(paymentOrder.amount)}</strong></p>
                  <p className="text-xs text-gray-400 mt-1">Gateway Order: {paymentOrder.gatewayOrderId}</p>
                </div>

                {paymentOrder.isDevMode ? (
                  <div className="flex gap-3">
                    <Button onClick={() => simulatePayment(true)} loading={loading} className="flex-1">
                      ✓ Simulate Success
                    </Button>
                    <Button
                      onClick={() => simulatePayment(false)}
                      variant="destructive"
                      loading={loading}
                      className="flex-1"
                    >
                      ✗ Simulate Failure
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    Use Razorpay payment widget (configure RAZORPAY_KEY_ID to enable)
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: order summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex-1 pr-2 truncate">
                    {item.product.name} × {item.qty}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatCurrency(Number(item.product.merchantProducts[0]?.basePrice ?? 0) * item.qty)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-2 space-y-1 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>{deliveryType === "HOME_DELIVERY" ? "₹40" : "Free"}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
