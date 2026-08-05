<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Select } from '$lib/components/ui/select';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '$lib/components/ui/table';
	import StatusBadge from '$lib/components/app/StatusBadge.svelte';
	import { formatDate } from '$lib/utils';
	import { MANUAL_CONTENT_STATUSES, type ContentStatus } from '$lib/types';
	import Plus from '@lucide/svelte/icons/plus';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statusFilter = $state<ContentStatus | 'all'>('all');

	const filtered = $derived(
		statusFilter === 'all' ? data.news : data.news.filter((n) => n.status === statusFilter)
	);

	const statusLabels: Record<string, string> = {
		draft: 'Draft',
		in_review: 'Ditinjau',
		approved: 'Disetujui',
		scheduled: 'Terjadwal',
		published: 'Terbit',
		archived: 'Diarsipkan',
		trashed: 'Sampah'
	};
</script>

<svelte:head>
	<title>Berita — {data.site.name}</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold">Berita — {data.site.name}</h1>
		<Button href="/sites/{data.site.id}/news/new"><Plus /> Berita Baru</Button>
	</div>

	<div class="flex items-center gap-2">
		<span class="text-sm text-muted-foreground">Filter status:</span>
		<Select bind:value={statusFilter} class="w-48">
			<option value="all">Semua</option>
			{#each [...MANUAL_CONTENT_STATUSES, 'published'] as status (status)}
				<option value={status}>{statusLabels[status]}</option>
			{/each}
		</Select>
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Judul</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Penulis</TableHead>
				<TableHead>Diperbarui</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each filtered as item (item.id)}
				<TableRow>
					<TableCell>
						<a href="/sites/{data.site.id}/news/{item.id}" class="font-medium hover:underline">{item.title}</a>
					</TableCell>
					<TableCell><StatusBadge status={item.status} /></TableCell>
					<TableCell class="text-muted-foreground">{item.authorName ?? '-'}</TableCell>
					<TableCell class="text-muted-foreground">{formatDate(item.updatedAt)}</TableCell>
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={4} class="py-8 text-center text-muted-foreground">Belum ada berita.</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
