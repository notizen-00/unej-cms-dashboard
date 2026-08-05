<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Select } from '$lib/components/ui/select';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Alert } from '$lib/components/ui/alert';
	import FormFieldError from '$lib/components/app/FormFieldError.svelte';
	import MarkdownEditor from '$lib/components/app/MarkdownEditor.svelte';
	import StatusBadge from '$lib/components/app/StatusBadge.svelte';
	import ConfirmDialog from '$lib/components/app/ConfirmDialog.svelte';
	import { allowedStatusTransitions, type ContentStatus } from '$lib/types';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import UploadCloud from '@lucide/svelte/icons/upload-cloud';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let bodyMarkdown = $state(form?.bodyMarkdown ?? data.news.bodyMarkdown);
	let currentStatus = $state<ContentStatus>((form?.status as ContentStatus) ?? data.news.status);
	let submitting = $state(false);
	let publishing = $state(false);
	let deleteOpen = $state(false);

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
	<title>{data.news.title} — {data.site.name}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<h1 class="text-xl font-semibold">{data.news.title}</h1>
			<StatusBadge status={data.news.status} />
		</div>
		<div class="flex gap-2">
			<form
				method="POST"
				action="?/publish"
				use:enhance={() => {
					publishing = true;
					return async ({ result, update }) => {
						publishing = false;
						if (result.type === 'success') {
							toast.success('Dipublikasikan. Situs akan diperbarui dalam beberapa detik.');
						}
						await update();
					};
				}}
			>
				<Button type="submit" variant="outline" disabled={publishing || data.news.status === 'published'}>
					{#if publishing}<LoaderCircle class="animate-spin" />{:else}<UploadCloud />{/if}
					Publish
				</Button>
			</form>
			<Button variant="destructive" size="icon" onclick={() => (deleteOpen = true)} title="Hapus berita">
				<Trash2 />
			</Button>
		</div>
	</div>

	<Card>
		<form
			method="POST"
			action="?/update"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') toast.success('Perubahan disimpan.');
					await update();
				};
			}}
		>
			<CardContent class="space-y-4 pt-6">
				{#if form?.message}
					<Alert variant="destructive">{form.message}</Alert>
				{/if}

				<div class="space-y-1.5">
					<Label for="title">Judul</Label>
					<Input id="title" name="title" value={form?.title ?? data.news.title} required />
					<FormFieldError errors={form?.errors} field="title" />
				</div>

				<div class="space-y-1.5">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={form?.slug ?? data.news.slug} required />
					<FormFieldError errors={form?.errors} field="slug" />
				</div>

				<div class="space-y-1.5">
					<Label for="status">Status</Label>
					<Select id="status" name="status" bind:value={currentStatus} class="w-48">
						{#each allowedStatusTransitions(data.news.status) as status (status)}
							<option value={status}>{statusLabels[status]}</option>
						{/each}
					</Select>
				</div>

				<div class="space-y-1.5">
					<Label for="excerpt">Ringkasan (maks. 500 karakter, opsional)</Label>
					<Textarea id="excerpt" name="excerpt" maxlength={500} rows={3} value={form?.excerpt ?? data.news.excerpt ?? ''} />
					<FormFieldError errors={form?.errors} field="excerpt" />
				</div>

				<div class="space-y-1.5">
					<Label for="featuredImageUrl">URL Gambar Utama (opsional)</Label>
					<Input
						id="featuredImageUrl"
						name="featuredImageUrl"
						type="url"
						value={form?.featuredImageUrl ?? data.news.featuredImageUrl ?? ''}
					/>
					<FormFieldError errors={form?.errors} field="featuredImageUrl" />
				</div>

				<MarkdownEditor name="bodyMarkdown" bind:value={bodyMarkdown} />
				<FormFieldError errors={form?.errors} field="bodyMarkdown" />
			</CardContent>
			<CardFooter class="justify-end gap-2">
				<Button type="button" variant="outline" href="/sites/{data.site.id}/news">Kembali</Button>
				<Button type="submit" disabled={submitting}>
					{#if submitting}<LoaderCircle class="animate-spin" />{/if}
					Simpan
				</Button>
			</CardFooter>
		</form>
	</Card>
</div>

<ConfirmDialog
	bind:open={deleteOpen}
	title="Hapus {data.news.title}?"
	description="Berita ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
	action="?/delete"
/>
