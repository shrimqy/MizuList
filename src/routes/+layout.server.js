/** @type {import('./$types').LayoutServerLoad} */
import { db } from '$lib/server/database';
let userData;
// get `locals.user` and pass it to the `page` store
export async function load({ locals, cookies }) {
	let username = locals.user?.name;
	if (username) {
		userData = await db.user.findUnique({
			where: { username }
		});
	}

	return {
		userData,
		user: locals.user
	};
}
