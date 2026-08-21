import { Ticket } from "lucide-react";

export function CouponBadge({ percent }: { percent: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[4px] bg-coupon-bg text-[12px] font-bold text-primary"
      style={{ height: 22, padding: "3px 6px" }}
    >
      <Ticket size={13} strokeWidth={2.2} />
      {percent}% OFF
    </span>
  );
}

export function ShippingBadge() {
  return (
    <span
      className="inline-flex items-center rounded-[4px] bg-shipping-bg text-[12px] font-medium text-shipping-text"
      style={{ height: 22, padding: "3px 6px" }}
    >
      Frete grátis
    </span>
  );
}

export function InstallmentsBadge({ count }: { count: number }) {
  return (
    <span
      className="inline-flex items-center rounded-[4px] text-[12px] font-medium text-primary"
      style={{ height: 22, padding: "3px 2px" }}
    >
      {count}x sem juros
    </span>
  );
}
