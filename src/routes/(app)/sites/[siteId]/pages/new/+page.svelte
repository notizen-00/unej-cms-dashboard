<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select } from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Alert } from '$lib/components/ui/alert';
	import FormFieldError from '$lib/components/app/FormFieldError.svelte';
	import MarkdownEditor from '$lib/components/app/MarkdownEditor.svelte';
	import { slugify } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let title = $state(form?.title ?? '');
	let slug = $state(form?.slug ?? '');
	let slugTouched = $state(false);
	let bodyMarkdown = $state(form?.bodyMarkdown ?? '');
	let isHomepage = $state(form?.isHomepage ?? false);
	let submitting = $state(false);

	function onTitleInput() {
		if (!slugTouched) slug = slugify(title);
	}

	const existingHomepage = $derived(data.pages.find((p) => p.isHomepage));
</script>

<svelte:head>
	<title>Halaman Baru — {data.site.name}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-4">
	<h1 class="text-xl font-semibold">Halaman Baru — {data.site.name}</h1>

	<Card>
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
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
					<Input id="title" name="title" bind:value={title} oninput={onTitleInput} required />
					<FormFieldError errors={form?.errors} field="title" />
				</div>

				<div class="space-y-1.5">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" bind:value={slug} oninput={() => (slugTouched = true)} required />
					<FormFieldError errors={form?.errors} field="slug" />
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="parentId">Halaman Induk (opsional)</Label>
						<Select id="parentId" name="parentId" value={form?.parentId ?? ''}>
							<option value="">Tidak ada</option>
							{#each data.pages as p (p.id)}
								<option value={p.id}>{p.title}</option>
							{/each}
						</Select>
					</div>
					<div class="space-y-1.5">
						<Label for="order">Urutan</Label>
						<Input id="order" name="order" type="number" value={form?.order ?? 0} />
					</div>
				</div>

				<div class="flex items-start gap-2">
					<Checkbox id="isHomepage" name="isHomepage" bind:checked={isHomepage} />
					<div class="space-y-1">
						<Label for="isHomepage">Jadikan halaman utama (homepage)</Label>
						{#if isHomepage && existingHomepage}
							<Alert variant="warning" class="text-xs">
								"{existingHomepage.title}" sudah jadi homepage. Backend tidak mencegah lebih dari satu homepage —
								pastikan Anda menonaktifkan yang lama secara manual.
							</Alert>
						{/if}
					</div>
				</div>

				<MarkdownEditor name="bodyMarkdown" bind:value={bodyMarkdown} />
				<FormFieldError errors={form?.errors} field="bodyMarkdown" />
			</CardContent>
			<CardFooter class="justify-end gap-2">
				<Button type="button" variant="outline" href="/sites/{data.site.id}/pages">Batal</Button>
				<Button type="submit" disabled={submitting}>
					{#if submitting}<LoaderCircle class="animate-spin" />{/if}
					Simpan
				</Button>
			</CardFooter>
		</form>
	</Card>
</div>
