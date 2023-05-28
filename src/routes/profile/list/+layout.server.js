/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

let username, bookId;
let fav,
	existingBook = null;

export async function load(locals) {
	console.log(locals.locals.user.name);
	if (locals && locals.locals.user && locals.locals.user.name) {
		username = locals.locals.user.name;
		// console.log(locals);
		fav = await db.fav.findMany({
			where: {
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

		// Attach bookCategory to each book
		existingBook = existingBook.map((book) => ({
			...book, // '...' allows to expand elements from an array or properties from an object
			bookCategory: book.bookCategory.map((category) => category.id)
		}));
	}
	return {
		existingBook,
		fav
	};
}
