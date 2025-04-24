<script lang="ts">
  import Card from '$lib/components/card.svelte';
  import Stack from '$lib/components/stack.svelte';
  import Project from '$lib/components/project.svelte';

  import { shuffleArray, tooltip } from '$lib/index.svelte';

  let { data } = $props();
  let stacks = $state(shuffleArray(data.stacks));
  let projects = $state(shuffleArray(data.projects));

  let cardElement: HTMLDivElement;
  let projectsElement: HTMLDivElement;
</script>

<div class="flex flex-col gap-8 items-center justify-start md:pb-20 md:pt-36 pt-16 margin">
  <h1 class="md:text-8xl text-5xl italic font-bold flex flex-col">
    <span class="-translate-x-12">Full Stack</span>
    <span class="translate-x-12">Developer</span>
  </h1>
  <p class="md:text-3xl text-lg text-center">
    Front-end to Back-end covered.<br/>
    Plan, create, deploy.
  </p>
  <div class="flex flex-row gap-4">
    <button class="btn bg-neutral-800" onclick={() => cardElement.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Contact Me</button>
    <button class="btn bg-white text-black" onclick={() => projectsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })}>See Projects</button>
  </div>
</div>

<div class="margin py-20 flex md:flex-row flex-col gap-8" bind:this={cardElement}>
  <Card />
  <div class="space-y-4">
    <div class="flex flex-row items-center gap-4">
      <h2 class="text-4xl font-bold md:text-start text-center">Stack</h2>
      <button class="text-3xl cursor-pointer" onclick={() => stacks = shuffleArray(data.stacks)} aria-label="Shuffle stack items">
        <i class="fa-solid fa-rotate-right" use:tooltip={() => ({ content: "Shuffle stack items" })}></i>
      </button>
    </div>
    <div class="flex flex-wrap md:justify-start justify-center gap-4">
      {#each stacks as item}
        <Stack stack={item} />
      {/each}
    </div>
  </div>
</div>

<div class="py-20 margin flex flex-col gap-8" bind:this={projectsElement}>
  <div class="flex flex-row items-center gap-4">
    <h2 class="text-4xl font-bold md:text-start text-center">Projects</h2>
    <button class="text-3xl cursor-pointer" onclick={() => projects = shuffleArray(data.projects)} aria-label="Shuffle projects">
      <i class="fa-solid fa-rotate-right" use:tooltip={() => ({ content: "Shuffle projects" })}></i>
    </button>
  </div>
  <div class="flex flex-row flex-wrap gap-4 overflow-hidden">
    {#each projects as item, index}
      <Project project={item} />
    {/each}
  </div>
</div>
