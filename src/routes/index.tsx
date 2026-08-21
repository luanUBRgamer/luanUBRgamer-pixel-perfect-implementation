import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { StoreHeader } from "@/components/store/StoreHeader";
import { SortTabs, type SortKey } from "@/components/store/SortTabs";
import { ProductCard, ProductCardSkeleton } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { PRODUCTS, type Product } from "@/data/products";
import { STORE } from "@/data/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${STORE.name} — Vitrine de moda, fitness e beleza` },
      {
        name: "description",
        content:
          "Vitrine com conjuntos fitness, pijamas, moda e beleza com cupons, frete grátis e parcelamento sem juros.",
      },
      { property: "og:title", content: `${STORE.name} — Vitrine` },
      {
        property: "og:description",
        content: "Produtos de moda, fitness e beleza com cupons e frete grátis.",
      },
    ],
  }),
  component: StorePage,
});

function sortProducts(list: Product[], key: SortKey, priceAsc: boolean): Product[] {
  const items = [...list];
  switch (key) {
    case "criador":
      return items.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "vendidos":
      return items.sort((a, b) => b.soldCount - a.soldCount);
    case "preco":
      return items.sort((a, b) => (priceAsc ? a.price - b.price : b.price - a.price));
    case "recomendado":
    default:
      return items;
  }
}

function StorePage() {
  const [sort, setSort] = useState<SortKey>("recomendado");
  const [priceAsc, setPriceAsc] = useState(true);
  const [view, setView] = useState<"list" | "grid">("list");
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setCollapsed(Math.min(1, window.scrollY / 120));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const products = useMemo(() => sortProducts(PRODUCTS, sort, priceAsc), [sort, priceAsc]);

  const handleTab = (key: SortKey) => {
    if (key === "preco" && sort === "preco") setPriceAsc((v) => !v);
    else if (key === "preco") setPriceAsc(true);
    setSort(key);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader collapsed={collapsed} />

      <div className="sticky top-0 z-20 bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="mx-auto w-full lg:max-w-[1200px]">
          <SortTabs
            active={sort}
            priceAsc={priceAsc}
            onChange={handleTab}
            view={view}
            onToggleView={() => setView((v) => (v === "list" ? "grid" : "list"))}
          />
        </div>
      </div>

      <main
        className={
          view === "list"
            ? "mx-auto w-full md:grid md:grid-cols-2 lg:max-w-[1200px] lg:grid-cols-4"
            : "mx-auto grid w-full grid-cols-2 lg:max-w-[1200px] lg:grid-cols-4"
        }
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} view={view === "grid" ? "grid" : "list"} />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full">
            <EmptyState />
          </div>
        ) : (
          products.map((product) => (
            <MediaCard key={product.id} product={product} view={view} />
          ))
        )}
      </main>
    </div>
  );
}

/** No mobile o card é horizontal; de md pra cima vira vertical (grade). */
function MediaCard({ product, view }: { product: Product; view: "list" | "grid" }) {
  if (view === "grid") return <ProductCard product={product} view="grid" />;
  return (
    <>
      <div className="md:hidden">
        <ProductCard product={product} view="list" />
      </div>
      <div className="hidden md:block">
        <ProductCard product={product} view="grid" />
      </div>
    </>
  );
}
