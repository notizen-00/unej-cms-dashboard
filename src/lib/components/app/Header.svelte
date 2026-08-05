<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import SiteSwitcher from './SiteSwitcher.svelte';
	import type { AuthUser, Site } from '$lib/types';
	import UserRound from '@lucide/svelte/icons/user-round';
	import LogOut from '@lucide/svelte/icons/log-out';
	import KeyRound from '@lucide/svelte/icons/key-round';

	let { user, sites, activeSite }: { user: AuthUser; sites: Site[]; activeSite: Site | null } = $props();
</script>

<header class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
	<SiteSwitcher {sites} {activeSite} />

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="sm" class="gap-2" {...props}>
					<span class="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
						{user.name?.[0]?.toUpperCase() ?? '?'}
					</span>
					<span class="max-w-40 truncate">{user.name}</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>
					<div class="flex flex-col">
						<span class="font-medium text-foreground">{user.name}</span>
						<span class="truncate text-xs text-muted-foreground">{user.email}</span>
					</div>
				</DropdownMenu.Label>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<a href="/account/sessions" {...props}>
						<KeyRound class="size-4" />
						Sesi saya
					</a>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child({ props })}
					<form method="POST" action="/logout" class="w-full">
						<button type="submit" class="flex w-full items-center gap-2 text-left text-destructive" {...props}>
							<LogOut class="size-4" />
							Keluar
						</button>
					</form>
				{/snippet}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</header>
