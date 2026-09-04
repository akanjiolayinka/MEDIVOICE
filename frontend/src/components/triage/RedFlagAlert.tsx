import { AlertTriangleIcon } from "@/components/icons";

export default function RedFlagAlert({ message }: { message: string }) {
  return (
    <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6" role="alert">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertTriangleIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-red-700">Urgent attention recommended</p>
          <p className="mt-1 text-sm text-foreground">{message}</p>
          <p className="mt-2 text-sm font-medium text-red-700">
            Please contact local emergency services or seek urgent medical care.
          </p>
        </div>
      </div>
    </div>
  );
}
