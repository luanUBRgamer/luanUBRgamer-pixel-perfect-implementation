import { Link, useNavigate } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import type { Product } from "@/data/products";
import { discountPercent } from "@/lib/format";
import { PriceTag } from "./PriceTag";
import { RatingLine } from "./RatingLine";
import { BuyButton } from "./BuyButton";
import { CouponBadge, InstallmentsBadge, ShippingBadge } from "./CouponBadge";

interface ProductCardProps {
  product: Product;
  view: "list" | "grid";
}

export function ProductCard({ product, view }: ProductCardProps) {
  const navigate = useNavigate();
  const outOfStock = product.stock <= 0;
  const percent = product.coupon?.percent ?? discountPercent(product.price, product.originalPrice);

  const handleBuy = (e?: MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (outOfStock) return;
    void navigate({
      to: "/produto/$slug",
      params: { slug: product.slug },
      resetScroll: true,
    });
  };

  const image = (
    <div
      className="relative shrink-0 overflow-hidden rounded-[8px] bg-surface"
      style={
        view === "list"
          ? { width: 124, height: 124 }
          : { width: "100%", aspectRatio: "1 / 1", height: "auto" }
      }
    >
      <img
        src={product.images[0]}
        alt={product.title}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${outOfStock ? "opacity-40" : ""}`}
      />
      {outOfStock && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-ink/80 px-3 py-1 text-[13px] font-bold text-white">
            Esgotado
          </span>
        </span>
      )}
    </div>
  );

  const content = (
    <div className="min-w-0 flex-1">
      <h3
        className="overflow-hidden text-[16px] font-semibold text-ink"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: "20px",
        }}
      >
        {product.official && (
          <span
            className="mr-1.5 inline-block rounded-[4px] bg-black align-[2px] text-[11px] font-bold text-official"
            style={{ padding: "3px 7px" }}
          >
            Oficial
          </span>
        )}
        {product.title}
      </h3>

      <div className="flex items-center" style={{ marginTop: 8, gap: 8, height: 22 }}>
        <CouponBadge percent={percent} />
        {product.freeShipping ? (
          <ShippingBadge />
        ) : (
          <InstallmentsBadge count={product.installments.count} />
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        <RatingLine rating={product.rating} soldCount={product.soldCount} />
      </div>

      <div className="flex items-end justify-between" style={{ marginTop: 14 }}>
        <PriceTag price={product.price} originalPrice={product.originalPrice} />
        <div onClick={(e) => e.preventDefault()}>
          <BuyButton onBuy={handleBuy} disabled={outOfStock} />
        </div>
      </div>
    </div>
  );

  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="block focus-visible:outline-2 focus-visible:outline-primary"
    >
      <article className="px-4">
        <div
          className={
            view === "list"
              ? "flex gap-3 border-b border-divider"
              : "flex flex-col gap-3 pb-4"
          }
          style={view === "list" ? { paddingTop: 18, paddingBottom: 18 } : { paddingTop: 18 }}
        >
          {image}
          {content}
        </div>
      </article>
    </Link>
  );
}

export function ProductCardSkeleton({ view }: { view: "list" | "grid" }) {
  return (
    <div
      className={
        view === "list"
          ? "mx-4 flex gap-3 border-b border-divider"
          : "mx-4 flex flex-col gap-3 pb-4"
      }
      style={{ paddingTop: 18, paddingBottom: 18 }}
    >
      <div
        className="shrink-0 animate-pulse rounded-[8px] bg-surface"
        style={view === "list" ? { width: 124, height: 124 } : { width: "100%", aspectRatio: "1/1" }}
      />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-surface" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-surface" />
        <div className="h-[22px] w-2/5 animate-pulse rounded bg-surface" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
        <div className="flex items-end justify-between pt-2">
          <div className="h-7 w-24 animate-pulse rounded bg-surface" />
          <div className="h-[34px] w-[104px] animate-pulse rounded-[6px] bg-surface" />
        </div>
      </div>
    </div>
  );
}
