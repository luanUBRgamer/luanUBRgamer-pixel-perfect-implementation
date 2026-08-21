import { Star } from "lucide-react";
import { formatCount } from "@/lib/format";

interface RatingLineProps {
  rating: number;
  soldCount: number;
  online?: boolean;
}

export function RatingLine({ rating, soldCount, online = true }: RatingLineProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Star size={15} className="fill-star text-star" strokeWidth={0} />
      <span className="text-[14px] font-medium text-ink">{rating.toFixed(1)}</span>
      <span aria-hidden="true" className="h-3 w-px bg-divider" style={{ marginInline: 3 }} />
      <span className="text-[14px] text-muted-fg">
        {formatCount(soldCount)} vendidos{online ? " online" : ""}
      </span>
    </div>
  );
}
