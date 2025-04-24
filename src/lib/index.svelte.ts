// place files you want to import through the `$lib` alias in this folder.
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
  return array;
}

import tippy from "tippy.js";
import type { Props } from "tippy.js";
import "tippy.js/dist/tippy.css";

export function tooltip(node: HTMLElement, fn: () => Partial<Props>) {
  $effect(() => {
    const tooltip = tippy(node, fn());
    return () => tooltip.destroy();
  });
}
