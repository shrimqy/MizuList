/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, bookId, userData;
let fav,
	existingBook = null;

export async function load({ locals, params }) {
	username = params.profileId;
	userData = await db.user.findUnique({
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

	// Attach bookCategory to each book
	existingBook = existingBook.map((book) => ({
		...book, // '...' allows to expand elements from an array or properties from an object
		bookCategory: book.bookCategory.map((category) => category.id)
	}));
	return {
		existingBook,
		fav,
		userData
	};
}
