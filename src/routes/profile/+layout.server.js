/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, bookId, user;
let fav,
	existingBook = null;

export async function load(locals) {
	let userData = null;

	if (locals && locals.locals.user && locals.locals.user.name) {
		username = locals.locals.user.name;
		user = await db.user.findUnique({
			where: { username }
		});

		fav = await db.fav.findMany({
			where: {
				bookId,
				User: {
					some: { username }
				}
			}
		});
		existingBook = await db.book.findMany({
			where: {
				User: {
					some: { username }
				}
			},
			include: {
				bookCategory: true
			}
		});

		// console.log(user);

		// Attach bookCategory to each book
		existingBook = existingBook.map((book) => ({
			...book, // '...' allows to expand elements from an array or properties from an object
			bookCategory: book.bookCategory.map((category) => category.id)
		}));
	} else {
		throw redirect(302, '/');
	}
	return {
		existingBook,
		fav,
		user
	};
}
