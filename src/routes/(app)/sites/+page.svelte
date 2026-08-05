<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '$lib/components/ui/table';
	import ConfirmDialog from '$lib/components/app/ConfirmDialog.svelte';
	import { formatDate } from '$lib/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { Site } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let deleteTarget = $state<Site | null>(null);
	let confirmOpen = $state(false);

	function askDelete(site: Site) {
		deleteTarget = site;
		confirmOpen = true;
	}
</script>

<svelte:head>
	<title>Sites — Unej CMS</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold">Sites</h1>
		<Button href="/sites/new"><Plus /> Site Baru</Button>
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Nama</TableHead>
				<TableHead>Slug</TableHead>
				<TableHead>Domain</TableHead>
				<TableHead>Dibuat</TableHead>
				<TableHead class="text-right">Aksi</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.sites as site (site.id)}
				<TableRow>
					<TableCell>
						<a href="/sites/{site.id}" class="font-medium hover:underline">{site.name}</a>
					</TableCell>
					<TableCell class="text-muted-foreground">{site.slug}</TableCell>
					<TableCell class="text-muted-foreground">{site.domain ?? '-'}</TableCell>
					<TableCell class="text-muted-foreground">{formatDate(site.createdAt)}</TableCell>
					<TableCell class="text-right">
						<div class="flex justify-end gap-2">
							<Button href="/sites/{site.id}/edit" variant="outline" size="sm">Edit</Button>
							<Button variant="destructive" size="icon" onclick={() => askDelete(site)} title="Hapus site">
								<Trash2 />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={5} class="py-8 text-center text-muted-foreground">Belum ada site.</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>

{#if deleteTarget}
	<ConfirmDialog
		bind:open={confirmOpen}
		title="Hapus {deleteTarget.name}?"
		description="Semua berita, halaman, dan riwayat build site ini akan ikut terhapus. Tindakan ini tidak bisa dibatalkan."
		action="/sites/{deleteTarget.id}?/delete"
	/>
{/if}
