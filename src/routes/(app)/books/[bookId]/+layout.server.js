/** @type {import('./$types').LayoutLoad} */
import { db } from '$lib/server/database';
export async function load({ locals, params }) {
	let bookId = await params.bookId;
	
	let userBook = await db.UserBook.findUnique({
		where: {
			userID_bookID: {
				userID: locals.user.id,
				bookID: bookId
			}
		},
		include: { 
			bookCategory: true,
			book: true
		}
	});

	return {
		userBook: userBook
	}
}
