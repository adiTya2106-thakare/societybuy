"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: result.error === "Account suspended"
            ? "Your account has been suspended. Contact support."
            : "Invalid email or password.",
          variant: "destructive",
        });
      } else {
        router.push("/app");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Login to your SocietyBuy account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-[#166534] hover:bg-[#14532D] text-white font-bold rounded-xl py-3 text-sm shadow-md" loading={loading}>
            Login to Your Society Account
          </Button>
        </form>

        {/* Demo Fast Login Chips */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            Demo Test Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setValue("email", "resident1@example.com");
                setValue("password", "Resident@1234");
              }}
              className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-[11px] font-bold text-emerald-900 transition-colors text-center"
            >
              🏢 Resident
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("email", "merchant@greenfield.in");
                setValue("password", "Merchant@1234");
              }}
              className="p-2 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/70 text-[11px] font-bold text-amber-900 transition-colors text-center"
            >
              🏪 Merchant
            </button>
            <button
              type="button"
              onClick={() => {
                setValue("email", "admin@societybuy.in");
                setValue("password", "Admin@1234");
              }}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-800 transition-colors text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="mt-4 text-center text-xs">
          <span className="text-gray-500">Don&apos;t have an account? </span>
          <Link href="/register" className="text-emerald-700 font-bold hover:underline">
            Register your apartment flat
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
