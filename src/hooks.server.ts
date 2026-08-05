import type { Handle } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';
import { getMe } from '$lib/server/api/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname, search } = event.url;
	const isLoginPage = pathname === '/login';

	try {
		event.locals.user = await getMe(event);
	} catch {
		// API unreachable / 5xx — surface a clear error instead of a silent redirect loop (PRD §12).
		if (isLoginPage) {
			event.locals.user = null;
		} else {
			error(503, 'Tidak bisa terhubung ke server API. Coba beberapa saat lagi.');
		}
	}

	if (!isLoginPage && !event.locals.user) {
		redirect(303, `/login?redirect=${encodeURIComponent(pathname + search)}`);
	}

	if (isLoginPage && event.locals.user) {
		redirect(303, '/');
	}

	return resolve(event);
};
