<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
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
	let submitting = $state(false);

	function onTitleInput() {
		if (!slugTouched) slug = slugify(title);
	}
</script>

<svelte:head>
	<title>Berita Baru — {data.site.name}</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-4">
	<h1 class="text-xl font-semibold">Berita Baru — {data.site.name}</h1>

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

				<div class="space-y-1.5">
					<Label for="excerpt">Ringkasan (maks. 500 karakter, opsional)</Label>
					<Textarea id="excerpt" name="excerpt" maxlength={500} rows={3} value={form?.excerpt ?? ''} />
					<FormFieldError errors={form?.errors} field="excerpt" />
				</div>

				<div class="space-y-1.5">
					<Label for="featuredImageUrl">URL Gambar Utama (opsional)</Label>
					<Input id="featuredImageUrl" name="featuredImageUrl" type="url" value={form?.featuredImageUrl ?? ''} />
					<FormFieldError errors={form?.errors} field="featuredImageUrl" />
				</div>

				<MarkdownEditor name="bodyMarkdown" bind:value={bodyMarkdown} />
				<FormFieldError errors={form?.errors} field="bodyMarkdown" />
			</CardContent>
			<CardFooter class="justify-end gap-2">
				<Button type="button" variant="outline" href="/sites/{data.site.id}/news">Batal</Button>
				<Button type="submit" disabled={submitting}>
					{#if submitting}<LoaderCircle class="animate-spin" />{/if}
					Simpan Draft
				</Button>
			</CardFooter>
		</form>
	</Card>
</div>
