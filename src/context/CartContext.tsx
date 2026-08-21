import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, quantity?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "vitrine.cart.v1";

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          title: product.title,
          image: product.images[0] ?? "",
          price: product.price,
          quantity,
        },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      add,
      remove,
      clear,
    }),
    [items, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
