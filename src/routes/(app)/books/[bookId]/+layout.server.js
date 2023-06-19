/** @type {import('./$types').LayoutLoad} */
import { db } from '$lib/server/database';
export async function load({ locals, params }) {
	const bookId = await params.bookId;
	const username = locals.user.name;

	const existingBook = await db.book.findFirst({
		where: {
			bookId,
			User: {
				some: { username }
			}
		},
		include: {
			bookCategory: true
		}
	});
	return {
		existingBook: existingBook
	};
}
