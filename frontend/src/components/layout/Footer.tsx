import Link from "next/link";
import Container from "@/components/layout/Container";

const columns: { label: string; href: string; external?: boolean }[] = [
  { label: "Product", href: "/" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "GitHub", href: "https://github.com/akanjiolayinka/MEDIVOICE", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-muted-200">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-500 sm:flex-row">
        <span>&copy; {new Date().getFullYear()} MediVoice Africa</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer">
          {columns.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </Container>
    </footer>
  );
}
