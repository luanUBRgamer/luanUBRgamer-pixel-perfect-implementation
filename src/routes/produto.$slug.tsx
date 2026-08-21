import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Info,
  MessageCircle,
  MoreHorizontal,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Store as StoreIcon,
  Ticket,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "@/data/products";
import { STORE } from "@/data/store";
import { useCart } from "@/context/CartContext";
import {
  deliveryRange,
  discountPercent,
  formatAmount,
  formatCount,
  formatCurrency,
  splitAmount,
} from "@/lib/format";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produto indisponível" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.title} — ${STORE.name}` },
        { name: "description", content: product.description },
        { property: "og:title", content: product.title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, count } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const percent = discountPercent(product.price, product.originalPrice);
  const price = splitAmount(product.price);
  const outOfStock = product.stock <= 0;
  const installmentValue = Math.round(product.price / product.installments.count);
  const requiredVariants = product.variants.map((v) => v.name);
  const allSelected = requiredVariants.every((name) => Boolean(selected[name]));

  const handleAdd = () => {
    add(product);
    toast("Adicionado ao carrinho", {
      description: product.title,
      action: { label: "Ver carrinho", onClick: () => undefined },
    });
  };

  const handleBuyNow = () => {
    if (!allSelected) {
      setSheetOpen(true);
      return;
    }
    handleAdd();
  };

  return (
    <div className="mx-auto min-h-screen max-w-[560px] bg-background pb-[76px]">
      {/* Barra superior */}
      <header className="flex items-center gap-3 px-4" style={{ height: 58 }}>
        <Link to="/" aria-label="Voltar" className="text-ink">
          <ChevronLeft size={26} strokeWidth={2.2} />
        </Link>
        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-tab-active px-3">
          <Search size={18} className="text-ink" strokeWidth={2.4} />
          <span className="truncate text-[16px] text-muted-fg">
            {product.category.toLowerCase()}
          </span>
        </div>
        <button type="button" aria-label="Compartilhar" className="text-ink">
          <Share2 size={22} strokeWidth={2.2} />
        </button>
        <button type="button" aria-label="Carrinho" className="relative text-ink">
          <ShoppingCart size={22} strokeWidth={2.2} />
          {count > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </button>
        <button type="button" aria-label="Mais opções" className="text-ink">
          <MoreHorizontal size={22} strokeWidth={2.4} />
        </button>
      </header>

      <ProductGallery
        images={product.images}
        title={product.title}
        onSizeClick={() => setSheetOpen(true)}
      />

      {/* Bloco de preço */}
      <section className="px-4" style={{ paddingTop: 14 }}>
        <div className="flex items-baseline gap-x-1 whitespace-nowrap">
          <span className="rounded-full bg-primary px-1.5 py-[1px] text-[15px] font-bold text-primary-foreground">
            -{percent}%
          </span>
          <span className="text-[17px] font-semibold text-primary">A partir de R$</span>
          <span className="text-[34px] font-bold leading-none text-primary">{price.whole}</span>
          <span className="text-[20px] font-bold text-primary">{price.cents}</span>
          <Ticket size={15} className="translate-y-[-2px] self-center text-primary" />
          <span className="text-[17px] text-strike line-through">
            R$ {formatAmount(product.originalPrice)}
          </span>
        </div>


        <button
          type="button"
          className="mt-3 flex w-full items-center gap-2 text-left"
          aria-label="Ver opções de parcelamento"
        >
          <CreditCard size={18} className="shrink-0 text-ink" strokeWidth={2} />
          <span className="text-[15px] text-ink">
            {product.installments.count}x {formatCurrency(installmentValue)}{" "}
            {product.installments.interestFree && <span className="text-primary">sem juros</span>}
          </span>
          <ChevronRight size={16} className="ml-auto text-muted-fg" />
        </button>

        {product.coupon && (
          <button
            type="button"
            className="mt-3 flex w-full items-center gap-2 text-left"
            aria-label="Ver detalhes do cupom"
          >
            <span className="flex items-center gap-1.5 rounded-[6px] border border-primary px-2 py-1">
              <Ticket size={15} className="text-primary" />
              <span className="text-[15px] font-medium text-primary">
                Desconto de {product.coupon.percent}%, máximo de{" "}
                {formatCurrency(product.coupon.maxDiscount).replace(/,00$/, "")}
              </span>
            </span>
            <ChevronRight size={16} className="ml-auto text-muted-fg" />
          </button>
        )}
      </section>

      {/* Título e avaliação */}
      <section className="px-4 pt-3">
        <div className="flex items-start gap-3">
          <h1 className="line-clamp-2 flex-1 text-[19px] font-bold leading-[25px] text-ink">
            {product.title}
          </h1>
          <button
            type="button"
            aria-label={saved ? "Remover dos salvos" : "Salvar produto"}
            aria-pressed={saved}
            onClick={() => setSaved((v) => !v)}
            className="mt-0.5 text-ink"
          >
            <Bookmark size={22} className={saved ? "fill-ink" : ""} strokeWidth={1.8} />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <Star size={16} className="fill-star text-star" strokeWidth={0} />
          <span className="text-[15px] font-bold text-ink">{product.rating.toFixed(1)}</span>
          <button type="button" className="text-[15px] text-[#2B6CE8]">
            ({formatCount(product.reviewCount).replace("K", " mil")})
          </button>
          <span className="mx-1 h-3.5 w-px bg-divider" aria-hidden="true" />
          <span className="text-[15px] text-muted-fg">
            {formatCount(product.soldCount)} vendidos on-line
          </span>
          <Info size={14} className="text-muted-fg" />
        </div>
      </section>

      {/* Entrega */}
      <div className="mt-3 h-2 bg-surface" aria-hidden="true" />
      <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <Truck size={20} className="shrink-0 text-ink" strokeWidth={1.8} />
        <span className="flex-1">
          <span className="block text-[17px] text-ink">Receba até {deliveryRange()}</span>
          <span className="block text-[15px] text-muted-fg">
            Taxa de envio:{" "}
            {product.freeShipping ? (
              <span className="text-shipping-text">Grátis</span>
            ) : (
              <>
                <span className="line-through">{formatCurrency(product.shippingFee + 500)}</span>{" "}
                {formatCurrency(product.shippingFee)}
              </>
            )}
          </span>
          <span className="block text-[15px] text-shipping-text">
            Desconto de R$ 5 no frete em pedidos acima de R$ 79
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted-fg" />
      </button>

      {/* Variantes */}
      <div className="h-2 bg-surface" aria-hidden="true" />
      <section className="px-4 py-3">
        {product.variants.map((variant) => (
          <div key={variant.name} className="mb-3 last:mb-0">
            <p className="text-[15px] font-semibold text-ink">{variant.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {variant.options.map((option) => {
                const isSelected = selected[variant.name] === option;
                const unavailable = outOfStock;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={unavailable}
                    aria-pressed={isSelected}
                    onClick={() => setSelected((prev) => ({ ...prev, [variant.name]: option }))}
                    className={`rounded-[6px] bg-background px-3 py-1.5 text-[14px] text-ink ${
                      isSelected
                        ? "border-[1.5px] border-ink font-semibold"
                        : "border border-[#E5E5E5]"
                    } ${unavailable ? "line-through opacity-40" : ""}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Descrição e specs */}
      <div className="h-2 bg-surface" aria-hidden="true" />
      <section className="px-4 py-4">
        <h2 className="text-[16px] font-bold text-ink">Descrição</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-muted-fg">{product.description}</p>
        <h2 className="mt-5 text-[16px] font-bold text-ink">Especificações</h2>
        <dl className="mt-2">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex gap-3 border-b border-divider py-2 last:border-0">
              <dt className="w-32 shrink-0 text-[14px] text-muted-fg">{spec.label}</dt>
              <dd className="text-[14px] text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Barra fixa inferior */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[560px] border-t border-divider bg-background pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center gap-2 px-3" style={{ height: 59 }}>
          <Link
            to="/"
            aria-label="Ir para a loja"
            className="flex w-11 flex-col items-center gap-0.5 text-ink"
          >
            <StoreIcon size={20} strokeWidth={1.8} />
            <span className="text-[11px]">Loja</span>
          </Link>
          <button
            type="button"
            aria-label="Abrir chat"
            className="flex w-11 flex-col items-center gap-0.5 text-ink"
          >
            <MessageCircle size={20} strokeWidth={1.8} />
            <span className="text-[11px]">Chat</span>
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="flex h-[46px] flex-1 items-center justify-center rounded-full bg-tab-active px-2 text-center text-[15px] font-bold leading-[17px] text-ink disabled:text-strike"
          >
            Adicionar
            <br />
            ao carrinho
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={outOfStock}
            className="flex h-[46px] flex-1 flex-col items-center justify-center rounded-full bg-primary px-2 text-primary-foreground disabled:bg-strike"
          >
            <span className="text-[16px] font-bold leading-[18px]">
              {outOfStock ? "Esgotado" : "Comprar agora"}
            </span>
            {!outOfStock && (
              <span className="text-[12px] font-normal leading-[14px]">
                {formatCurrency(product.price)}
              </span>
            )}
          </button>

        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-[17px] text-ink">Selecione as opções</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            {product.variants.map((variant) => (
              <div key={variant.name} className="mb-4">
                <p className="text-[15px] font-semibold text-ink">{variant.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variant.options.map((option) => {
                    const isSelected = selected[variant.name] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelected((prev) => ({ ...prev, [variant.name]: option }))}
                        className={`rounded-[6px] bg-background px-3 py-1.5 text-[14px] text-ink ${
                          isSelected
                            ? "border-[1.5px] border-ink font-semibold"
                            : "border border-[#E5E5E5]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={!allSelected}
              onClick={() => {
                setSheetOpen(false);
                handleAdd();
              }}
              className="h-12 w-full rounded-full bg-primary text-[17px] font-bold text-primary-foreground disabled:bg-strike"
            >
              Confirmar
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
