"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const { user, isLoading } = useAuth();

  return (
    <header className="border-b border-muted-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight">
          MediVoice
        </Link>

        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-500 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && user ? (
            <Button href="/app" className="px-4 py-2 text-sm">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-500 transition-colors hover:text-foreground sm:block"
              >
                Login
              </Link>
              <Button href="/signup" className="px-4 py-2 text-sm">
                Get Started
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
