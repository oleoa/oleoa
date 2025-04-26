<script lang="ts">
  import { shuffleArray, tooltip } from "$lib/index.svelte";

  let { project } = $props();
  const imageMap = import.meta.glob('/src/lib/assets/stacks/*.svg', { eager: true });
  const images = Object.fromEntries(
    Object.entries(imageMap).map(([path, mod]) => {
      const fileName = path.split('/').pop() ?? '';
      const key = fileName.replace('.svg', '');
      return [key, (mod as { default: string }).default];
    })
  );

  const stacks = $derived(shuffleArray(project.stacks))
</script>

<div class="bg-neutral-800 rounded-lg p-8 flex flex-col gap-4">
  <div class="flex flex-row gap-12 justify-between">
    <div class="flex flex-col gap-2">
      <h3 class="text-2xl font-bold">{project.name}</h3>
      <p class="text-sm text-neutral-400">{project.description}</p>
    </div>
    <div class="flex flex-row items-center justify-center gap-4 text-2xl">
      {#if project.link}
        <a href={project.link} target="_blank" aria-label="Visit website" use:tooltip={() => ({ content: "Check it out" })}>
          <i class="fa-solid fa-globe"></i>
        </a>
      {/if}
      {#if project.source}
        <a href={project.source} target="_blank" aria-label="View source code" use:tooltip={() => ({ content: "View source code" })}>
          <i class="fa-solid fa-code"></i>
        </a>
      {/if}
    </div>
  </div>
  <div class="flex flex-row flex-wrap gap-4">
    {#each stacks as stack}
      <img src={images[stack]} alt={stack} class="w-10 h-10 invert" use:tooltip={() => ({ content: stack })} />
    {/each}
  </div>
</div>
