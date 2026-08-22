import { Link } from "@tanstack/react-router";
import { ChevronLeft, Search, Share2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { STORE } from "@/data/store";
import { useCart } from "@/context/CartContext";

interface StoreHeaderProps {
  /** 0 = expandido, 1 = encolhido */
  collapsed: number;
}

export function StoreHeader({ collapsed }: StoreHeaderProps) {
  const { count } = useCart();
  const [following, setFollowing] = useState(STORE.following);

  const scale = 1 - collapsed * 0.12;

  return (
    <header
      className="relative overflow-hidden bg-black"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        height: `calc(${232 - collapsed * 44}px + env(safe-area-inset-top))`,
      }}
    >
      {/* Marca-d'água configurável da loja */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-bold leading-none text-watermark"
        style={{ fontSize: 300, right: -60, top: 10 }}
      >
        {STORE.watermarkText}
      </span>

      <div className="relative">
        {/* Barra de navegação */}
        <div className="flex items-center justify-between px-4" style={{ height: 56 }}>
          <Link
            to="/"
            aria-label="Voltar"
            className="-ml-[9px] flex h-11 w-11 items-center justify-center text-white focus-visible:outline-2"
          >
            <ChevronLeft size={26} strokeWidth={2} />
          </Link>
          <div className="flex items-center text-white" style={{ gap: 2 }}>
            <button
              type="button"
              aria-label="Buscar"
              className="flex h-11 w-11 items-center justify-center"
            >
              <Search size={26} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Compartilhar"
              className="flex h-11 w-11 items-center justify-center"
            >
              <Share2 size={26} strokeWidth={2} />
            </button>
            <Link to="/carrinho" aria-label="Abrir carrinho" className="relative flex h-11 w-11 items-center justify-center">
              <ShoppingCart size={26} strokeWidth={2} />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div
          className="origin-top-left px-4 transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Avatar + nome */}
          <div className="flex items-center" style={{ gap: 14 }}>
            <img
              src={STORE.avatar}
              alt={`Avatar da loja ${STORE.name}`}
              width={63}
              height={63}
              loading="lazy"
              className="rounded-full border border-white object-cover"
              style={{ width: 63, height: 63 }}
            />
            <h1 className="text-[24px] font-bold leading-tight text-white">{STORE.name}</h1>
          </div>

          {/* Estatísticas + botão seguir */}
          <div className="mt-5 flex items-end justify-between">
            <div className="flex items-center">
              <Stat value={STORE.followers} label="Seguidores" />
              <span aria-hidden="true" className="h-9 w-px bg-neutral-700" style={{ marginInline: 28 }} />
              <Stat value={String(STORE.productCount)} label="Produtos" />
            </div>
            <button
              type="button"
              onClick={() => setFollowing((v) => !v)}
              aria-pressed={following}
              className="rounded-full text-[19px] font-semibold text-white"
              style={{
                backgroundColor: "rgba(255,255,255,0.16)",
                padding: "12px 22px",
              }}
            >
              {following ? "Seguindo" : "Seguir"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[22px] font-bold leading-tight text-white">{value}</div>
      <div className="text-[17px] leading-tight text-[#A1A1A6]">{label}</div>
    </div>
  );
}
