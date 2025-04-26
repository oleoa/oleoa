// place files you want to import through the `$lib` alias in this folder.
export function shuffleArray(array: any[]) {
  const new_array = [...array];
  for (let i = new_array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [new_array[i], new_array[j]] = [new_array[j], new_array[i]]; // swap elements
  }
  return new_array;
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
