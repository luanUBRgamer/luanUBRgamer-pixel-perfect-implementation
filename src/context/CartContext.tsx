import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  /** productId + variantes selecionadas */
  key: string;
  productId: string;
  slug: string;
  title: string;
  image: string;
  price: number; // centavos
  originalPrice: number; // centavos
  quantity: number;
  stock: number;
  variants: Record<string, string>;
}

interface CartContextValue {
  items: CartItem[];
  /** soma das quantidades */
  count: number;
  total: number;
  add: (product: Product, variants?: Record<string, string>, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "store:cart";

const CartContext = createContext<CartContextValue | null>(null);

function variantKey(productId: string, variants: Record<string, string>): string {
  const parts = Object.keys(variants)
    .sort()
    .map((name) => `${name}=${variants[name]}`);
  return [productId, ...parts].join("|");
}

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("formato inválido");
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === "object" && i !== null && typeof (i as CartItem).key === "string",
    );
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora quota */
    }
  }, [items]);

  const add = useCallback(
    (product: Product, variants: Record<string, string> = {}, quantity = 1) => {
      const key = variantKey(product.id, variants);
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) {
          return prev.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, Math.max(product.stock, 1)) }
              : i,
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            slug: product.slug,
            title: product.title,
            image: product.images[0] ?? "",
            price: product.price,
            originalPrice: product.originalPrice,
            quantity,
            stock: product.stock,
            variants,
          },
        ];
      });
    },
    [],
  );

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key
          ? { ...i, quantity: Math.max(1, Math.min(quantity, Math.max(i.stock, 1))) }
          : i,
      ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error(
      "useCart() foi chamado fora de <CartProvider>. Monte o CartProvider acima das rotas (src/routes/__root.tsx).",
    );
  }
  return ctx;
}
