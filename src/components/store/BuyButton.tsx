import { ShoppingCart } from "lucide-react";

interface BuyButtonProps {
  onBuy: () => void;
  disabled?: boolean;
  label?: string;
}

export function BuyButton({ onBuy, disabled = false, label = "Comprar" }: BuyButtonProps) {
  return (
    <div className="flex shrink-0 items-stretch" style={{ height: 34, width: 104 }}>
      <button
        type="button"
        onClick={onBuy}
        disabled={disabled}
        aria-label="Adicionar ao carrinho"
        className="flex w-[38px] items-center justify-center rounded-l-[6px] bg-primary-soft text-primary disabled:bg-divider disabled:text-strike"
      >
        <ShoppingCart size={17} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onBuy}
        disabled={disabled}
        className="flex flex-1 items-center justify-center rounded-r-[6px] bg-primary text-[16px] font-bold text-primary-foreground disabled:bg-strike"
      >
        {disabled ? "Esgotado" : label}
      </button>
    </div>
  );
}
