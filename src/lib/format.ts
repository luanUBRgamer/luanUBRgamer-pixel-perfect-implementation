const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos como moeda brasileira. */
export function formatCurrency(cents: number): string {
  return brl.format(cents / 100);
}

/** Retorna apenas o número formatado, sem o símbolo "R$". */
export function formatAmount(cents: number): string {
  return brl.format(cents / 100).replace(/^R\$\s?/, "");
}

/** Percentual de desconto, sempre calculado. */
export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

/** 41200 -> "41.2K" */
export function formatCount(value: number): string {
  if (value < 1000) return String(value);
  const k = value / 1000;
  return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}K`;
}

/** 13490 -> { whole: "134", cents: ",90" } */
export function splitAmount(cents: number): { whole: string; cents: string } {
  const formatted = formatAmount(cents);
  const [whole, dec] = formatted.split(",");
  return { whole: whole ?? "0", cents: `,${dec ?? "00"}` };
}

/** Faixa de entrega: "24–28 de ago" */
export function deliveryRange(from = 3, to = 7, base = new Date()): string {
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const start = new Date(base);
  start.setDate(start.getDate() + from);
  const end = new Date(base);
  end.setDate(end.getDate() + to);
  const label = month.format(end).replace(".", "");
  return `${start.getDate()}–${end.getDate()} de ${label}`;
}
