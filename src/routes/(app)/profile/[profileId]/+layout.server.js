/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, bookId, userData;
let fav,
	existingBook = null;
let userFollow;
export async function load({ locals, params }) {
	username = params.profileId;
	userData = await db.User.findUnique({
		where: { username }
	});

	userFollow = await db.User.findUnique ({
		where: {
			username: locals.user.name
		},
		select: {
			following: {
				where: {
					username: username
				},
				select: {
					username: true
				}
			}
		}
	})

	fav = await db.Favorite.findMany({
		where: {
			user: {
				some: { username }
			}
		},
		include: {
			book: true
		}
	});

	existingBook = await db.UserBook.findMany({
		where: {
			user: {
				is: { username }
			}
		},
		include: {
			bookCategory: {
				select: {
					id: true,
				},
			},
			book: {
				select: {
					romanizedTitle: true,
					englishTitle: true,
					nativeTitle: true,
					authors: true,
					coverUrl: true,
					chapters: true,
				}
			}
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
		userData,
		username,
		userFollow
	};
}
