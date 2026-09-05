"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }
    router.push("/app");
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    await loginAsDemo();
    router.push("/app");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-100/60 px-4 py-12">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-muted-200 bg-white p-8 shadow-sm">
          <Link href="/" className="block text-center text-lg font-semibold tracking-tight">
            MediVoice
          </Link>
          <h1 className="mt-6 text-center text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-center text-sm text-muted-500">
            Log in to continue your conversation with MediVoice.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="mb-1.5 text-xs font-medium text-primary-700 hover:text-primary-900"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-accent-700">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-muted-200 text-primary-600 focus:ring-primary-100"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotMessage(true)}
                className="font-medium text-primary-700 hover:text-primary-900"
              >
                Forgot password?
              </button>
            </div>
            {forgotMessage && (
              <p className="text-xs text-muted-500">
                Password reset isn&rsquo;t available in this demo — try the demo account below instead.
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-muted-200" />
            <span className="text-xs text-muted-500">or</span>
            <span className="h-px flex-1 bg-muted-200" />
          </div>

          <button
            type="button"
            onClick={handleDemo}
            disabled={isDemoLoading}
            className="w-full rounded-full border border-muted-200 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {isDemoLoading ? "Signing you in…" : "Try Demo"}
          </button>

          <button
            type="button"
            onClick={handleDemo}
            disabled={isDemoLoading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-muted-200 px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            Continue with Google
            <span className="rounded-full bg-muted-100 px-2 py-0.5 text-[10px] font-medium text-muted-500">
              mock
            </span>
          </button>

          <p className="mt-6 text-center text-sm text-muted-500">
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary-700 hover:text-primary-900">
              Sign up
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
