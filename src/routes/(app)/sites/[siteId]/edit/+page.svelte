<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Alert } from '$lib/components/ui/alert';
	import FormFieldError from '$lib/components/app/FormFieldError.svelte';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let submitting = $state(false);
</script>

<svelte:head>
	<title>Edit {data.site.name} — Unej CMS</title>
</svelte:head>

<div class="mx-auto max-w-xl space-y-4">
	<h1 class="text-xl font-semibold">Edit Site</h1>

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
					<Label for="name">Nama Site</Label>
					<Input id="name" name="name" value={form?.name ?? data.site.name} required />
					<FormFieldError errors={form?.errors} field="name" />
				</div>

				<div class="space-y-1.5">
					<Label for="slug">Slug</Label>
					<Input id="slug" name="slug" value={form?.slug ?? data.site.slug} pattern="^[a-z0-9-]+$" required />
					<FormFieldError errors={form?.errors} field="slug" />
				</div>

				<div class="space-y-1.5">
					<Label for="domain">Domain (opsional)</Label>
					<Input id="domain" name="domain" value={form?.domain ?? data.site.domain ?? ''} />
					<FormFieldError errors={form?.errors} field="domain" />
				</div>

				<div class="space-y-1.5">
					<Label for="logoUrl">Logo URL (opsional)</Label>
					<Input id="logoUrl" name="logoUrl" type="url" value={form?.logoUrl ?? data.site.logoUrl ?? ''} />
					<FormFieldError errors={form?.errors} field="logoUrl" />
				</div>

				<div class="space-y-1.5">
					<Label for="faviconUrl">Favicon URL (opsional)</Label>
					<Input id="faviconUrl" name="faviconUrl" type="url" value={form?.faviconUrl ?? data.site.faviconUrl ?? ''} />
					<FormFieldError errors={form?.errors} field="faviconUrl" />
				</div>
			</CardContent>
			<CardFooter class="justify-end gap-2">
				<Button type="button" variant="outline" href="/sites/{data.site.id}">Batal</Button>
				<Button type="submit" disabled={submitting}>
					{#if submitting}<LoaderCircle class="animate-spin" />{/if}
					Simpan
				</Button>
			</CardFooter>
		</form>
	</Card>
</div>
