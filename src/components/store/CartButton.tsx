import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  size?: number;
  className?: string;
}

/** Ícone de carrinho clicável que leva para /carrinho, com badge de quantidade. */
export function CartButton({ size = 26, className = "" }: CartButtonProps) {
  const { count } = useCart();

  return (
    <Link
      to="/carrinho"
      aria-label="Abrir carrinho"
      className={`relative flex h-11 w-11 items-center justify-center ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ShoppingCart size={size} strokeWidth={2} />
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
