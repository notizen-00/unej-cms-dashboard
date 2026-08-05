<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils.js';
	import { canManageMembers, canManageSite } from '$lib/permissions';
	import type { AuthUser, Site } from '$lib/types';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Globe from '@lucide/svelte/icons/globe';
	import Users from '@lucide/svelte/icons/users';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import FileText from '@lucide/svelte/icons/file-text';
	import UserCog from '@lucide/svelte/icons/user-cog';
	import Settings from '@lucide/svelte/icons/settings';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import KeyRound from '@lucide/svelte/icons/key-round';

	let { user, activeSite }: { user: AuthUser; activeSite: Site | null } = $props();

	const pathname = $derived(page.url.pathname);

	function isActive(href: string, exact = false) {
		return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

{#snippet navLink(href: string, label: string, Icon: typeof Globe, exact = false)}
	<a
		{href}
		class={cn(
			'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
			isActive(href, exact)
				? 'bg-primary text-primary-foreground'
				: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
		)}
	>
		<Icon class="size-4 shrink-0" />
		<span class="truncate">{label}</span>
	</a>
{/snippet}

<nav class="flex h-full w-60 shrink-0 flex-col gap-1 border-r border-border bg-card p-3">
	<div class="mb-2 px-2 py-1.5">
		<span class="text-sm font-semibold">Unej CMS</span>
	</div>

	{@render navLink('/', 'Dashboard', LayoutDashboard, true)}

	{#if user.isSuperAdmin}
		<p class="mt-3 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Administrasi</p>
		{@render navLink('/sites', 'Sites', Globe, true)}
		{@render navLink('/users', 'Users', Users)}
	{/if}

	{#if activeSite}
		<p class="mt-3 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
			{activeSite.name}
		</p>
		{@render navLink(`/sites/${activeSite.id}`, 'Ringkasan Site', ShieldCheck, true)}
		{@render navLink(`/sites/${activeSite.id}/news`, 'Berita', Newspaper)}
		{@render navLink(`/sites/${activeSite.id}/pages`, 'Halaman', FileText)}
		{#if canManageMembers(user)}
			{@render navLink(`/sites/${activeSite.id}/members`, 'Anggota', UserCog)}
		{/if}
		{#if canManageSite(user, [activeSite], activeSite.id)}
			{@render navLink(`/sites/${activeSite.id}/edit`, 'Pengaturan Site', Settings)}
		{/if}
	{/if}

	<div class="mt-auto pt-3">
		{@render navLink('/account/sessions', 'Sesi Saya', KeyRound)}
	</div>
</nav>
