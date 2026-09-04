import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/benchmark", label: "Research" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  return (
    <header className="border-b border-muted-200">
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

        <Button href="/app" className="px-4 py-2 text-sm">
          Try MediVoice
        </Button>
      </Container>
    </header>
  );
}
