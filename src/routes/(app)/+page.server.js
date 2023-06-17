/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
let lastActivity, userData, existingBook;
export async function load(locals) {
	let username = locals.locals.user?.name;
	if (username) {
		userData = await db.user.findUnique({
			where: { username }
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
	lastActivity = await db.activity.findMany({
		orderBy: {
			timestamp: 'desc'
		},
		include: {
			category: true,
			user: true
		}
	});
	return {
		lastActivity: lastActivity.slice(0, 20),
		userData: userData,
		existingBook
	};
}
