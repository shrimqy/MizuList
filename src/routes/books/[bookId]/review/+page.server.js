let username, bookId;
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
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
		bookId = params.bookId;
		username = locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});

		const existing = await db.reviews.findFirst({
			where: {
				bookId: bookId,
				userId: user.id
			}
		});

		if (existing) {
			await db.reviews.update({
				where: { id: existing.id },
				data: {
					review: review,
					recommendation: recommendation,
					spoiler: spoiler
				}
			});
		} else {
			await db.reviews.create({
				data: {
					review: review,
					recommendation: recommendation,
					spoiler: spoiler,
					bookId: bookId,
					userId: user.id
				}
			});
		}
		// throw redirect(`/books/${bookId}`)
		return { success: true };
	}
};
