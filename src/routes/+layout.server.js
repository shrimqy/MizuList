/** @type {import('./$types').LayoutServerLoad} */
// get `locals.user` and pass it to the `page` store
export async function load({ locals, cookies, params }) {
	return {
		user: locals.user
	};
}
