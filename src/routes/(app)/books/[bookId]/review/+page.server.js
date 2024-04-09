let username, bookId, userBook;
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	bookId = await params.bookId;
	
	userBook = await db.UserBook.findUnique({
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
	return {};
}
/** @type {import('./$types').Actions} */
export const actions = {
	review: async ({ request, locals, params }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const data = await request.formData();
		const review = data.get('review');
		const recommendation = data.get('recommendation');
		const spoiler = data.get('spoiler');
		username = locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});

		const existing = await db.review.findFirst({
			where: {
				bookID: bookId,
				userID: user.id
			}
		});

		if (existing) {
			await db.review.update({
				where: { id: existing.id },
				data: {
					review: review,
					recommendation: recommendation,
					spoiler: spoiler,
					rating: userBook.rating,
				}
			});
		} else {
			await db.review.create({
				data: {
					review: review,
					recommendation: recommendation,
					spoiler: spoiler,
					bookID: bookId,
					userID: user.id,
					rating: userBook.rating,

				}
			});
		}
		// throw redirect(`/books/${bookId}`)
		return { success: true };
	}
};
