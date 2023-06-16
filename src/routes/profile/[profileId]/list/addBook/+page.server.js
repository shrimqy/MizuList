/** @type {import('./$types').PageServerLoad} */
import { redirect } from '@sveltejs/kit';

export async function load() {
	throw redirect('/profile');
}

import { db } from '$lib/server/database';

/** @type {import('./$types').Actions} */
export const actions = {
	addBook: async ({ locals, request, params }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const username = locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});

		const referer = request.headers.get('referer');
		const data = await request.formData();
		const title = data.get('title');
		const author = data.get('author');
		const rating = data.get('rating');
		const status = data.get('status');
		const categoryId = parseInt(status, 10);
		const chapters = data.get('chapters');
		const tpages = data.get('tpages');
		const pages = data.get('pages');
		const rereads = data.get('rereads');
		const startedAt = data.get('startDate');
		const notes = data.get('notes');
		let startedDateTime = undefined;
		if (startedAt) {
			startedDateTime = new Date(startedAt).toISOString();
		}

		const completedAt = data.get('finishDate');
		const completedDateTime = undefined;
		if (completedAt) {
			completedDateTime = new Date(completedAt).toISOString();
		}

		const existingBook = await db.Book.findFirst({
			where: {
				title
			},
			include: {
				bookCategory: true
			}
		});

		if (existingBook) {
			await db.Book.update({
				where: { id: existingBook.id },
				data: {
					title: title,
					pages: pages,
					chapters: chapters,
					rating: rating,
					rereads: rereads,
					completedAt: completedDateTime,
					createdAt: startedDateTime,
					author: author,
					tPages: tpages,
					notes: notes,
					bookCategory: {
						// Disconnecting the category at index 1 from the existing book's categories
						disconnect: [{ id: existingBook.bookCategory[1].id }],
						// Connecting the new category and the "All" category to the book
						connect: [{ id: categoryId }, { id: 1 }]
					},
					User: {
						connect: { id: user.id }
					}
				}
			});
		} else {
			await db.Book.create({
				data: {
					UserId: user.id,
					title: title,
					pages: pages,
					chapters: chapters,
					rating: rating,
					author: author,
					tPages: tpages,
					rereads: rereads,
					completedAt: completedDateTime,
					bookCategory: {
						// Connecting the new category and the "All" category to the book
						connect: [{ id: categoryId }, { id: 1 }]
					},
					User: {
						//connect to the User record using the id
						connect: { id: user.id }
					}
				}
			});
		}
		throw redirect(303, `${referer}`);
	}
};
