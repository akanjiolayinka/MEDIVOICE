import Link from "next/link";
import Container from "@/components/layout/Container";

export default function Footer() {
  return (
    <footer className="border-t border-muted-200">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-500 sm:flex-row">
        <span>&copy; {new Date().getFullYear()} MediVoice Africa</span>
        <nav className="flex items-center gap-6" aria-label="Footer">
          <Link href="/how-it-works" className="hover:text-foreground">
            How it works
          </Link>
          <Link href="/benchmark" className="hover:text-foreground">
            Research
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
