import type { MouseEvent } from "react";
import { ShoppingCart } from "lucide-react";

interface BuyButtonProps {
  onAddToCart: (e: MouseEvent) => void;
  onViewProduct: (e: MouseEvent) => void;
  disabled?: boolean;
  label?: string;
}

export function BuyButton({
  onAddToCart,
  onViewProduct,
  disabled = false,
  label = "Comprar",
}: BuyButtonProps) {
  return (
    <div className="flex shrink-0 items-stretch" style={{ height: 34, width: 104 }}>
      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        aria-label="Adicionar ao carrinho"
        className="relative flex w-[38px] items-center justify-center rounded-l-[6px] bg-primary-soft text-primary active:brightness-95 disabled:bg-divider disabled:text-strike after:absolute after:inset-y-[-5px] after:inset-x-0 after:content-['']"
      >
        <ShoppingCart size={17} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onViewProduct}
        disabled={disabled}
        aria-label="Ver produto"
        className="relative flex flex-1 items-center justify-center rounded-r-[6px] bg-primary text-[16px] font-bold text-primary-foreground active:brightness-95 disabled:bg-strike after:absolute after:inset-y-[-5px] after:inset-x-0 after:content-['']"
      >
        {disabled ? "Esgotado" : label}
      </button>
    </div>
  );
}
