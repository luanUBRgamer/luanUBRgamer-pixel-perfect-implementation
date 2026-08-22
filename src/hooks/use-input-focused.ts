import { useEffect, useState } from "react";

/**
 * No iOS, uma barra `position: fixed` flutua sobre o campo quando o teclado
 * abre. Este hook detecta foco em input/select/textarea (focusin/focusout)
 * para que as barras fixas possam se esconder enquanto o usuário digita.
 */
export function useInputFocused(): boolean {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const isField = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable);

    const onFocusIn = (e: FocusEvent) => {
      if (isField(e.target)) setFocused(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (isField(e.target)) setFocused(false);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return focused;
}
