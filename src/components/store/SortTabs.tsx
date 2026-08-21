import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, LayoutGrid, List, ChevronUp, ChevronDown } from "lucide-react";

export type SortKey = "criador" | "recomendado" | "vendidos" | "preco";

interface SortTabsProps {
  active: SortKey;
  priceAsc: boolean;
  onChange: (key: SortKey) => void;
  view: "list" | "grid";
  onToggleView: () => void;
}

const TABS: { key: SortKey; label: string }[] = [
  { key: "criador", label: "Escolha do criador" },
  { key: "recomendado", label: "Recomendado" },
  { key: "vendidos", label: "Mais vendidos" },
  { key: "preco", label: "Preço" },
];

export function SortTabs({ active, priceAsc, onChange, view, onToggleView }: SortTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollLeft > 8);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative flex items-center bg-background" style={{ height: 64 }}>
      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-1 items-center overflow-x-auto"
        style={{ paddingLeft: 16, paddingRight: 56, gap: 6 }}
      >
        <button
          type="button"
          aria-label="Filtros"
          className="flex shrink-0 items-center justify-center rounded-full bg-tab-active text-ink transition-all duration-200"
          style={{
            width: scrolled ? 0 : 44,
            height: 44,
            opacity: scrolled ? 0 : 1,
            marginRight: scrolled ? 0 : 8,
          }}
        >
          <SlidersHorizontal size={20} strokeWidth={2} />
        </button>

        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full text-[19px] ${
                isActive ? "bg-tab-active font-bold text-ink" : "font-medium text-[#6B6B70]"
              }`}
              style={{ padding: "10px 16px" }}
            >
              {tab.label}
              {tab.key === "preco" && (
                <span className="flex flex-col leading-none">
                  <ChevronUp
                    size={11}
                    strokeWidth={3}
                    className={isActive && priceAsc ? "text-ink" : "text-strike"}
                  />
                  <ChevronDown
                    size={11}
                    strokeWidth={3}
                    className={isActive && !priceAsc ? "text-ink" : "text-strike"}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 flex h-full items-center pl-6 pr-4 bg-gradient-to-r from-transparent via-background to-background">
        <button
          type="button"
          onClick={onToggleView}
          aria-label={view === "list" ? "Ver em grade" : "Ver em lista"}
          className="text-ink"
        >
          {view === "list" ? (
            <LayoutGrid size={24} strokeWidth={2} />
          ) : (
            <List size={24} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}
