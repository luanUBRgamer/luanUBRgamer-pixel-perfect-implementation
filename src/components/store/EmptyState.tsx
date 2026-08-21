import { PackageOpen } from "lucide-react";

export function EmptyState({
  title = "Nenhum produto encontrado",
  description = "Tente outra aba ou volte mais tarde.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <PackageOpen size={40} className="text-strike" strokeWidth={1.6} />
      <p className="mt-4 text-[16px] font-semibold text-ink">{title}</p>
      <p className="mt-1 text-[14px] text-muted-fg">{description}</p>
    </div>
  );
}
