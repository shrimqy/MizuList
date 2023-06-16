/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, bookId, userData;
let fav,
	existingBook = null;

export async function load(locals) {
	if (locals && locals.locals.user && locals.locals.user.name) {
		username = locals.locals.user.name;
		userData = await db.user.findUnique({
			where: { username }
		});
	} else {
		throw redirect(302, '/');
	}
	return {
		userData
	};
}
