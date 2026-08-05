<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Users — Unej CMS</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-semibold">Users</h1>
		<Button href="/users/new"><Plus /> User Baru</Button>
	</div>

	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Nama</TableHead>
				<TableHead>Email</TableHead>
				<TableHead>Role</TableHead>
				<TableHead>Dibuat</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each data.users as user (user.id)}
				<TableRow>
					<TableCell>
						<a href="/users/{user.id}/edit" class="font-medium hover:underline">{user.name}</a>
					</TableCell>
					<TableCell class="text-muted-foreground">{user.email}</TableCell>
					<TableCell>
						{#if user.isSuperAdmin}
							<Badge>Super Admin</Badge>
						{:else}
							<Badge variant="outline">User</Badge>
						{/if}
					</TableCell>
					<TableCell class="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
				</TableRow>
			{:else}
				<TableRow>
					<TableCell colspan={4} class="py-8 text-center text-muted-foreground">Belum ada user.</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</div>
