import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediVoice — Healthcare conversations that sound like home",
  description:
    "Speak naturally in English, Nigerian Pidgin, Yoruba, Igbo or Hausa. MediVoice understands code-switched conversations, asks the right follow-up questions, and helps you take the next step toward care.",
};

// No Nav/Footer here — the public marketing site and the authenticated
// app each get their own shell (see app/(marketing)/layout.tsx and
// app/app/layout.tsx) so the logged-in product doesn't inherit the
// marketing chrome.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
