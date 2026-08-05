<script lang="ts">
	import { page } from '$app/state';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import type { Site } from '$lib/types';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import Check from '@lucide/svelte/icons/check';

	let { sites, activeSite }: { sites: Site[]; activeSite: Site | null } = $props();
</script>

{#if sites.length > 1}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" size="sm" class="gap-1.5" {...props}>
					<span class="max-w-40 truncate">{activeSite?.name ?? 'Pilih site'}</span>
					<ChevronsUpDown class="size-3.5 text-muted-foreground" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Beralih site</DropdownMenu.Label>
				{#each sites as site (site.id)}
					<a
						href="/switch-site/{site.id}?back={encodeURIComponent(page.url.pathname)}"
						class="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
					>
						<Check class={`size-3.5 ${site.id === activeSite?.id ? 'opacity-100' : 'opacity-0'}`} />
						<span class="truncate">{site.name}</span>
					</a>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{:else if activeSite}
	<span class="text-sm font-medium text-muted-foreground">{activeSite.name}</span>
{/if}
