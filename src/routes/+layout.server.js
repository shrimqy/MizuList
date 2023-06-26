/** @type {import('./$types').LayoutServerLoad} */
import { db } from '$lib/server/database';
let userprofile, username;
// get `locals.user` and pass it to the `page` store
export async function load({ locals, cookies, params }) {
	return {
		user: locals.user
	};
}
