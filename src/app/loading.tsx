import { LotusIcon } from "@/components/LotusIcon";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <div className="flex flex-col items-center gap-4">
        <LotusIcon size={48} className="animate-pulse-gentle" />
        <div className="gold-divider" />
      </div>
    </div>
  );
}
