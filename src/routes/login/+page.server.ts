import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { login } from '$lib/server/api/auth';
import { ApiError } from '$lib/server/api/client';

export const load: PageServerLoad = async ({ url }) => {
	return {
		redirectTo: url.searchParams.get('redirect') ?? '/'
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const redirectTo = String(formData.get('redirectTo') ?? '/');

		if (!email || !password) {
			return fail(400, {
				email,
				errors: [{ path: 'email', message: 'Email dan password wajib diisi.' }]
			});
		}

		try {
			await login(event, email, password);
		} catch (err) {
			if (err instanceof ApiError) {
				return fail(err.status === 0 ? 503 : 401, {
					email,
					message: err.status === 429 ? err.message : 'Email atau password salah.'
				});
			}
			throw err;
		}

		redirect(303, redirectTo.startsWith('/') ? redirectTo : '/');
	}
};
