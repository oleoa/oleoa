<script lang="ts">
  import Me from '$lib/assets/me.png';
  import Github from '$lib/assets/stacks/github.svg';
  let copied = $state(false);
</script>

<div class="rounded-lg bg-neutral-800 p-4 flex flex-col items-start gap-4 text-white h-fit">
  <img src={Me} alt="Leonardo" class="rounded-lg w-full object-cover">
  <div class="flex flex-row gap-4 items-center">
    <h2 class="text-2xl font-bold">Leonardo Abreu</h2>
    <a href="https://github.com/oleoa" target="_blank">
      <img src={Github} alt="Github" class="invert w-6 h-6">
    </a>
  </div>
  <div class="flex flex-col gap-2">
    <p>
      I'm a full stack developer with a passion for building web applications.
    </p>
  </div>
  <div class="w-fit flex gap-2 items-center border-2 py-2 px-4 rounded-lg border-green-600 text-green-600">
    <span class="animate-pulse flex items-center justify-center w-2 h-2 rounded-full bg-green-600"></span>
    <p>Avaiable for work</p>
  </div>
  <button class="flex flex-row md:gap-4 gap-2 border-2 px-4 py-2 rounded-lg items-center text-sm cursor-pointer" onclick={() => {
    navigator.clipboard.writeText('leonardo.abreu.de.paulo@gmail.com');
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 500);
  }} aria-label="Copy email">
    <p>leonardo.abreu.de.paulo@gmail.com</p>
    {#if copied}
      <i class="fa-solid fa-check"></i>
    {:else}
      <i class="fa-solid fa-copy"></i>
    {/if}
  </button>
</div>
