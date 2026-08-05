<script lang="ts">
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/app/Sidebar.svelte';
	import Header from '$lib/components/app/Header.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const activeSite = $derived(data.sites.find((site) => site.id === data.activeSiteId) ?? null);
</script>

<div class="flex h-screen w-full overflow-hidden">
	<Sidebar user={data.user} {activeSite} />
	<div class="flex min-w-0 flex-1 flex-col">
		<Header user={data.user} sites={data.sites} {activeSite} />
		<main class="flex-1 overflow-y-auto p-6">
			{@render children()}
		</main>
	</div>
</div>
