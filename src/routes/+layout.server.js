/** @type {import('./$types').LayoutServerLoad} */
import { db } from '$lib/server/database';
let userprofile, username;
// get `locals.user` and pass it to the `page` store
export async function load({ locals, cookies, params }) {
	username = params.profileId;
	if (username) {
		userprofile = await db.user.findUnique({
			where: { username }
		});
	}

	return {
		user: locals.user,
		userprofile
	};
}
