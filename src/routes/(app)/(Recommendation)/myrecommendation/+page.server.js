/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username;
let existingBook = null;
export async function load({ locals }) {
	username = locals.user.name;
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
					coverUrl: true,
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
		if (selections[0] && selections[1]) {
			const existing = await db.recommendation.findFirst({
				where: {
					book1Id: selections[0],
					book2Id: selections[1]
				}
			});
			if (!existing) {
				await db.recommendation.create({
					data: {
						book1Id: book1,
						book2Id: book2,
					}
				});
			}
		}
	}
};
