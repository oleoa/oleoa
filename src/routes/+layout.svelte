<script lang="ts">
  // import Navbar from "$lib/components/navbar.svelte";
  import "../app.css";
	let { children } = $props();
</script>

<!-- <Navbar /> -->

<main class="bg-neutral-900 min-h-screen text-white">
  {@render children()}
</main>

