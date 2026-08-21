import { formatAmount } from "@/lib/format";

interface PriceTagProps {
  price: number;
  originalPrice: number;
}

export function PriceTag({ price, originalPrice }: PriceTagProps) {
  return (
    <div>
      <div className="flex items-baseline text-primary">
        <span className="text-[14px] font-bold">R$</span>
        <span className="ml-0.5 text-[24px] font-bold leading-none">{formatAmount(price)}</span>
      </div>
      {originalPrice > price && (
        <div className="mt-0.5 text-[15px] text-strike line-through">
          R$ {formatAmount(originalPrice)}
        </div>
      )}
    </div>
  );
}
