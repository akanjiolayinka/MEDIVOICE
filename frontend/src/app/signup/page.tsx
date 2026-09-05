"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

const LANGUAGES = ["English", "Nigerian Pidgin", "Yoruba", "Igbo", "Hausa"];
const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+", "Prefer not to say"];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState(LANGUAGES[0]);
  const [ageRange, setAgeRange] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the terms to continue.");
      return;
    }

    setIsSubmitting(true);
    const result = await signup({ firstName, lastName, email, password, preferredLanguage, ageRange });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSucceeded(true);
    setTimeout(() => router.push("/app"), 1200);
  };

  if (succeeded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-100/60 px-4">
        <Container className="max-w-md">
          <div className="rounded-3xl border border-muted-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
              ✓
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight">You&rsquo;re all set, {firstName}.</h1>
            <p className="mt-2 text-sm text-muted-500">Taking you to MediVoice…</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-100/60 px-4 py-12">
      <Container className="max-w-lg">
        <div className="rounded-3xl border border-muted-200 bg-white p-8 shadow-sm">
          <Link href="/" className="block text-center text-lg font-semibold tracking-tight">
            MediVoice
          </Link>
          <h1 className="mt-6 text-center text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-center text-sm text-muted-500">
            Set up MediVoice in less than a minute.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="preferredLanguage" className="mb-1.5 block text-sm font-medium">
                  Preferred language
                </label>
                <select
                  id="preferredLanguage"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ageRange" className="mb-1.5 block text-sm font-medium">
                  Age range <span className="font-normal text-muted-500">(optional)</span>
                </label>
                <select
                  id="ageRange"
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full rounded-xl border border-muted-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select…</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-500">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-muted-200 text-primary-600 focus:ring-primary-100"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-primary-700 hover:text-primary-900">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-primary-700 hover:text-primary-900">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p role="alert" className="text-sm text-accent-700">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary-700 hover:text-primary-900">
              Log in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
