import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logout } from '$lib/server/api/auth';

export const POST: RequestHandler = async (event) => {
	await logout(event);
	redirect(303, '/login');
};
