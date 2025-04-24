<script lang="ts">
  import { tooltip } from '$lib/index.svelte';
  let { stack } = $props();

  const imageMap = import.meta.glob('/src/lib/assets/stacks/*.svg', { eager: true });
  const images = Object.fromEntries(
    Object.entries(imageMap).map(([path, mod]) => {
      const fileName = path.split('/').pop() ?? '';
      const key = fileName.replace('.svg', '');
      return [key, (mod as { default: string }).default];
    })
  );
</script>

<a href={stack.href} target="_blank" aria-label="Visit {stack.name} website" class="flex flex-col items-center justify-center p-4 border-2 border-neutral-700 hover:bg-neutral-700 transition-all duration-300 rounded-lg w-24 h-24 cursor-pointer" use:tooltip={() => ({ content: stack.name })}>
  <img src={images[stack.src]} alt={stack.name} class="invert" />
</a>
