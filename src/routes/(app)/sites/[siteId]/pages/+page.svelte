<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '$lib/components/ui/table';
	import StatusBadge from '$lib/components/app/StatusBadge.svelte';
	import { formatDate } from '$lib/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import Home from '@lucide/svelte/icons/home';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function parentTitle(parentId: string | null) {
		if (!parentId) return '-';
		return data.pages.find((p) => p.id === parentId)?.title ?? '-';
	}
</script>

<svelte:head>
	<title>Halaman — {data.site.name}</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold">Halaman — {data.site.name}</h1>
		<Button href="/sites/{data.site.id}/pages/new"><Plus /> Halaman Baru</Button>
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Judul</TableHead>
				<TableHead>Induk</TableHead>
				<TableHead>Urutan</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Diperbarui</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.pages as item (item.id)}
				<TableRow>
					<TableCell>
						<a href="/sites/{data.site.id}/pages/{item.id}" class="inline-flex items-center gap-1.5 font-medium hover:underline">
							{#if item.isHomepage}<Home class="size-3.5 text-muted-foreground" />{/if}
							{item.title}
						</a>
					</TableCell>
					<TableCell class="text-muted-foreground">{parentTitle(item.parentId)}</TableCell>
					<TableCell class="text-muted-foreground">{item.order}</TableCell>
					<TableCell><StatusBadge status={item.status} /></TableCell>
					<TableCell class="text-muted-foreground">{formatDate(item.updatedAt)}</TableCell>
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={5} class="py-8 text-center text-muted-foreground">Belum ada halaman.</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
