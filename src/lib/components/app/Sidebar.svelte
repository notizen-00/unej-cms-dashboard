<script lang="ts">
	import { page } from '$app/state';
	import { canManageSite } from '$lib/permissions';
	import type { AuthUser, Site } from '$lib/types';
	import { cn } from '$lib/utils.js';

	import FileText from '@lucide/svelte/icons/file-text';
	import Globe2 from '@lucide/svelte/icons/globe-2';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import Users from '@lucide/svelte/icons/users';
	import X from '@lucide/svelte/icons/x';

	let {
		user,
		activeSite,
		mobileOpen = false,
		onClose = () => {}
	}: {
		user: AuthUser;
		activeSite: Site | null;
		mobileOpen?: boolean;
		onClose?: () => void;
	} = $props();

	const pathname = $derived(page.url.pathname);

	const createContentHref = $derived(
		activeSite
			? `/sites/${activeSite.id}/news/new`
			: user.isSuperAdmin
				? '/sites/new'
				: '/'
	);

	const settingsHref = $derived(
		activeSite && canManageSite(user, [activeSite], activeSite.id)
			? `/sites/${activeSite.id}/edit`
			: '/account/sessions'
	);

	function isActive(href: string, exact = false) {
		return exact
			? pathname === href
			: pathname === href || pathname.startsWith(`${href}/`);
	}
</script>

{#snippet navLink(
	href: string,
	label: string,
	Icon: typeof LayoutDashboard,
	exact = false
)}
	<a
		{href}
		onclick={onClose}
		class={cn(
			'relative flex h-11 items-center gap-3 border-l-[3px] px-4 text-[13px] font-medium transition-colors',
			isActive(href, exact)
				? 'border-[#075985] bg-[#f0f3ff] text-[#075985]'
				: 'border-transparent text-[#47627d] hover:bg-[#f6f8fc] hover:text-[#075985]'
		)}
	>
		<Icon
			size={18}
			strokeWidth={isActive(href, exact) ? 2.2 : 1.8}
			class="shrink-0"
		/>

		<span class="truncate">{label}</span>
	</a>
{/snippet}

<aside
	class={cn(
		'fixed inset-y-0 left-0 z-50 flex w-[224px] shrink-0 flex-col border-r border-[#e1e7ef] bg-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none',
		mobileOpen ? 'translate-x-0' : '-translate-x-full'
	)}
>
	<header class="flex h-16 shrink-0 items-center border-b border-[#e5eaf1] px-4">
		<a href="/" class="flex min-w-0 items-center gap-2.5" onclick={onClose}>
			<div
				class="grid h-9 w-9 shrink-0 place-items-center rounded-[2px] bg-[#075985] text-sm font-bold text-white"
			>
				U
			</div>

			<div class="min-w-0">
				<p class="truncate text-[17px] font-bold leading-5 text-[#06294a]">
					Unej CMS
				</p>

				<p class="truncate text-[9px] leading-3 text-[#64748b]">
					Admin Panel
				</p>
			</div>
		</a>

		<button
			type="button"
			class="ml-auto grid h-8 w-8 place-items-center text-[#64748b] hover:bg-[#f1f5f9] lg:hidden"
			aria-label="Tutup navigasi"
			onclick={onClose}
		>
			<X size={18} />
		</button>
	</header>

	<nav class="min-h-0 flex-1 overflow-y-auto py-4">
		{@render navLink('/', 'Dashboard', LayoutDashboard, true)}

		{#if activeSite}
			{@render navLink(
				`/sites/${activeSite.id}/news`,
				'Konten Berita',
				Newspaper
			)}

			{@render navLink(
				`/sites/${activeSite.id}/pages`,
				'Halaman Statis',
				FileText
			)}
		{/if}

		{#if user.isSuperAdmin}
			{@render navLink('/sites', 'Kelola Situs', Globe2, true)}
			{@render navLink('/users', 'Pengguna', Users)}
		{/if}
	</nav>

	<div class="shrink-0 border-t border-[#e5eaf1] px-3 py-4">
		<a
			href={createContentHref}
			onclick={onClose}
			class="mb-4 flex h-9 w-full items-center justify-center gap-2 border border-[#075985] bg-white px-3 text-[11px] font-medium text-[#075985] transition-colors hover:bg-[#075985] hover:text-white"
		>
			<Plus size={15} strokeWidth={2} />
			<span>
				{activeSite ? 'Buat Konten Baru' : 'Buat Situs Baru'}
			</span>
		</a>

		<a
			href={settingsHref}
			onclick={onClose}
			class="flex h-9 items-center gap-3 px-3 text-[12px] font-medium text-[#47627d] transition-colors hover:bg-[#f6f8fc] hover:text-[#075985]"
		>
			<Settings size={17} strokeWidth={1.8} />
			<span>Pengaturan</span>
		</a>

		<form method="POST" action="/logout">
			<button
				type="submit"
				class="flex h-9 w-full items-center gap-3 px-3 text-left text-[12px] font-medium text-[#47627d] transition-colors hover:bg-red-50 hover:text-red-600"
			>
				<LogOut size={17} strokeWidth={1.8} />
				<span>Keluar</span>
			</button>
		</form>
	</div>
</aside>