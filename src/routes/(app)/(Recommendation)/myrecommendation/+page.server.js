/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username;
let existingBook = null;
export async function load({ locals }) {
	username = locals.user.name;
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
		existingBook
	};
}

export const actions = {
	recommendation: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const data = await request.formData();
		const selections = data.getAll('selections');
		const book1 = selections[0];
		const book2 = selections[1];
		username = locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});
		if (selections[0] && selections[1]) {
			const existing = await db.recommendation.findFirst({
				where: {
					book1Id: selections[0],
					book2Id: selections[1]
				}
			});
			if (!existing) {
				const resbook1 = await db.book.findFirst({
					where: {
						bookId: book1
					}
				});

				const resbook2 = await db.book.findFirst({
					where: {
						bookId: book2
					}
				});
				await db.recommendation.create({
					data: {
						book1Id: resbook1.bookId,
						title1: resbook1.title,
						cover1: resbook1.covers,
						title2: resbook2.title,
						book2Id: resbook2.bookId,
						cover2: resbook2.covers
					}
				});
			}
		}
	}
};
