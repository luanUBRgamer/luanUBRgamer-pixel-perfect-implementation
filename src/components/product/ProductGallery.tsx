import { useRef, useState } from "react";
import { AudioLines } from "lucide-react";
import { STORE } from "@/data/store";

interface ProductGalleryProps {
  images: string[];
  title: string;
  onSizeClick: () => void;
}

export function ProductGallery({ images, title, onSizeClick }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== index) setIndex(next);
  };

  return (
    <div className="relative aspect-square w-full bg-tab-active">
      <div
        ref={ref}
        onScroll={handleScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((src, i) => (
          <div key={src} className="flex h-full w-full shrink-0 snap-center items-center justify-center p-6">
            <img
              src={src}
              alt={`${title} — imagem ${i + 1} de ${images.length}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      {STORE.isLive === true && (
        <div
          className="absolute right-0 top-6 flex flex-col items-center justify-center gap-1 rounded-l-xl bg-background"
          style={{ width: 66, height: 66 }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <AudioLines size={16} className="text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-[13px] font-bold leading-none text-ink">LIVE</span>
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-px overflow-hidden rounded-full">
        <span
          className="flex items-center bg-black/40 px-3 text-[14px] text-white"
          style={{ height: 26 }}
        >
          {index + 1}/{images.length}
        </span>
        <button
          type="button"
          onClick={onSizeClick}
          className="flex items-center bg-black/40 px-3 text-[14px] text-white"
          style={{ height: 26 }}
        >
          Tamanho
        </button>
      </div>
    </div>
  );
}
