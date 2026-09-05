import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRightIcon } from "@/components/icons";

interface FeatureCardProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}

export default function FeatureCard({ icon: Icon, title, description, buttonLabel, href }: FeatureCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-muted-200 bg-white p-6 transition-shadow hover:shadow-md">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm text-muted-500">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-900"
      >
        {buttonLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
