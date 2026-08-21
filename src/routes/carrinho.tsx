import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { formatAmount, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Vitrine de Jade" },
      { name: "description", content: "Revise os itens do seu carrinho e finalize a compra." },
      { property: "og:title", content: "Carrinho — Vitrine de Jade" },
      {
        property: "og:description",
        content: "Revise os itens do seu carrinho e finalize a compra.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const router = useRouter();
  const { items, remove, setQuantity } = useCart();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      for (const item of items) next[item.key] = prev[item.key] ?? true;
      return next;
    });
  }, [items]);

  const chosen = items.filter((i) => selected[i.key]);
  const total = chosen.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = chosen.reduce(
    (sum, i) => sum + Math.max(i.originalPrice - i.price, 0) * i.quantity,
    0,
  );
  const selectedQty = chosen.reduce((sum, i) => sum + i.quantity, 0);
  const allChecked = items.length > 0 && chosen.length === items.length;

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    for (const item of items) next[item.key] = !allChecked;
    setSelected(next);
  };

  return (
    <div className="mx-auto min-h-screen max-w-[560px] bg-background pb-[86px]">
      <header
        className="flex items-center gap-2 border-b border-divider px-2"
        style={{ height: 58 }}
      >
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => router.history.back()}
          className="flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} strokeWidth={2.2} />
        </button>
        <h1 className="flex-1 text-center text-[19px] font-bold text-ink">
          Carrinho{" "}
          {items.length > 0 && (
            <span className="font-normal text-muted-fg">({items.length})</span>
          )}
        </h1>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="h-11 px-3 text-[16px] text-ink"
        >
          {editing ? "Concluir" : "Editar"}
        </button>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center px-8" style={{ paddingTop: 96 }}>
          <ShoppingCart size={72} strokeWidth={1.4} className="text-[#D9D9D9]" />
          <p className="mt-5 text-[17px] font-semibold text-ink">Seu carrinho está vazio</p>
          <p className="mt-1 text-center text-[15px] text-muted-fg">
            Explore a vitrine e adicione produtos para continuar.
          </p>
          <Link
            to="/"
            className="mt-6 flex h-12 items-center justify-center rounded-full bg-primary px-7 text-[16px] font-bold text-primary-foreground"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <ul>
          {items.map((item) => {
            const variantLabel = Object.values(item.variants).join(", ");
            return (
              <li
                key={item.key}
                className="flex items-start gap-3 border-b border-divider px-4"
                style={{ paddingTop: 14, paddingBottom: 14 }}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={Boolean(selected[item.key])}
                  aria-label={`Selecionar ${item.title}`}
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`mt-8 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    selected[item.key]
                      ? "border-primary bg-primary"
                      : "border-[#D9D9D9] bg-background"
                  }`}
                >
                  {selected[item.key] && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        d="M5 12.5l4.5 4.5L19 7.5"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                <Link to="/produto/$slug" params={{ slug: item.slug }} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="rounded-[8px] bg-surface object-cover"
                    style={{ width: 88, height: 88 }}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[15px] font-semibold text-ink">{item.title}</p>
                  {variantLabel && (
                    <span className="mt-1 inline-block rounded-[4px] bg-surface px-1.5 py-[2px] text-[13px] text-[#6B6B70]">
                      {variantLabel}
                    </span>
                  )}
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-1 whitespace-nowrap">
                      <span className="text-[13px] font-bold text-primary">R$</span>
                      <span className="text-[20px] font-bold leading-none text-primary">
                        {formatAmount(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[14px] text-strike line-through">
                          R$ {formatAmount(item.originalPrice)}
                        </span>
                      )}
                    </span>

                    {editing ? (
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="flex h-[28px] items-center gap-1 rounded-[6px] bg-primary px-3 text-[13px] font-bold text-primary-foreground"
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-stretch" style={{ height: 28 }}>
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          className="flex w-8 items-center justify-center rounded-l-[6px] border border-[#E5E5E5] text-ink disabled:text-strike"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex w-9 items-center justify-center border-y border-[#E5E5E5] text-[14px] text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          disabled={item.quantity >= item.stock}
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          className="flex w-8 items-center justify-center rounded-r-[6px] border border-[#E5E5E5] text-ink disabled:text-strike"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[560px] border-t border-divider bg-background pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center gap-3 px-4" style={{ height: 62 }}>
            <button
              type="button"
              role="checkbox"
              aria-checked={allChecked}
              onClick={toggleAll}
              className="flex shrink-0 items-center gap-2 text-[14px] text-ink"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  allChecked ? "border-primary bg-primary" : "border-[#D9D9D9]"
                }`}
              >
                {allChecked && (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              Todos
            </button>

            <div className="ml-auto text-right">
              <p className="flex items-baseline justify-end gap-1">
                <span className="text-[14px] text-ink">Total:</span>
                <span className="text-[22px] font-bold leading-none text-primary">
                  {formatCurrency(total)}
                </span>
              </p>
              <p className="text-[12px] text-muted-fg">
                Você economizou {formatCurrency(savings)}
              </p>
            </div>

            <button
              type="button"
              disabled={chosen.length === 0}
              onClick={() => toast("Checkout em breve")}
              className="flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-[17px] font-bold text-primary-foreground disabled:opacity-40"
            >
              Finalizar ({selectedQty})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
