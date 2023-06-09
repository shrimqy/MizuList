/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
export const prerender = true;
let username, fav, lastActivity, stats;

export async function load(locals) {
	// console.log(locals.locals.user.name);
	if (locals && locals.locals.user && locals.locals.user.name) {
		username = locals.locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});
		lastActivity = await db.activity.findMany({
			where: {
				userId: {
					equals: user.id
				}
			},
			orderBy: {
				timestamp: 'desc'
			},
			include: {
				category: true
			}
		});

		stats = await db.BookCategory.findMany({
			where: {
				User: {
					some: {
						username: username
					}
				}
			},
			include: {
				Book: {
					where: {
						User: {
							some: {
								username: username
							}
						}
					}
				}
			}
		});

		stats = stats.map((category) => ({
			...category,
			Book: category.Book.map((book) => book.id)
		}));
	}

	return {
		lastActivity,
		stats
	};
}
