<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert } from '$lib/components/ui/alert';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let submitting = $state(false);
</script>

<svelte:head>
	<title>Login — Unej CMS</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-muted/30 px-4">
	<div class="w-full max-w-sm space-y-6">
		<div class="text-center">
			<h1 class="text-xl font-semibold">Unej CMS</h1>
			<p class="text-sm text-muted-foreground">Masuk ke dashboard admin</p>
		</div>

		<form
			method="POST"
			class="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}
		>
			<input type="hidden" name="redirectTo" value={data.redirectTo} />

			{#if form?.message}
				<Alert variant="destructive">{form.message}</Alert>
			{/if}

			<div class="space-y-1.5">
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
				/>
			</div>

			<div class="space-y-1.5">
				<Label for="password">Password</Label>
				<Input id="password" name="password" type="password" autocomplete="current-password" required />
			</div>

			<Button type="submit" class="w-full" disabled={submitting}>
				{#if submitting}
					<LoaderCircle class="animate-spin" />
				{/if}
				Masuk
			</Button>
		</form>
	</div>
</div>
