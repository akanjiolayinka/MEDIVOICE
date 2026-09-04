import Badge from "@/components/ui/Badge";

export default function NotConfiguredBanner({
  service,
  message,
}: {
  service: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-accent-400/60 bg-accent-100/50 p-6 text-center">
      <Badge tone="accent" className="mb-3">
        {service} not configured
      </Badge>
      <p className="text-sm text-muted-500">{message}</p>
    </div>
  );
}
