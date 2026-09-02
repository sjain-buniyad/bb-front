"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps a main content area's left margin in sync with the sidebar's width
 * (which animates between collapsed/expanded states).
 *
 * @param mainRef      ref of the element whose marginLeft is adjusted
 * @param selector     CSS selector matching the sidebar element
 * @param extraOffset  additional pixels added to the sidebar width
 */
export function useSidebarSync(
  mainRef: RefObject<HTMLElement | null>,
  selector = "aside",
  extraOffset = 0,
): void {
  useEffect(() => {
    const sidebar = document.querySelector<HTMLElement>(selector);
    const main = mainRef.current;
    if (!sidebar || !main) return;

    const sync = () => {
      main.style.marginLeft = `${extraOffset + sidebar.offsetWidth}px`;
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    window.addEventListener("resize", sync);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [mainRef, selector, extraOffset]);
}
