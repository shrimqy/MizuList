/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, fav, lastActivity, stats;

let userFollow;

export async function load({ locals, params, parent }) {
	await parent;
	username = params.profileId;
	const user = await db.user.findUnique({
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

	lastActivity = await db.activity.findMany({
		where: {
			userID: {
				equals: user.id
			}
		},
		orderBy: {
			timestamp: 'desc'
		},
		include: {
			category: true,
			book: true
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
			UserBook: {
				where: {
					user: {
						is: {
							username: username
						}
					}
				},
				select: { id: true }
			}
		}
	});

	stats = stats.map((category) => ({
		...category,
		UserBook: category.UserBook.map((book) => book.id)
	}));

	return {
		lastActivity,
		stats,
		userFollow
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	SocialAction: async ({ request, locals, params }) => {
		const currentUserPage = params.profileId
		
		
		if (userFollow?.following[0]?.username == null) {
			await db.User.update ({
				where: {
					username: locals.user.name
				},
				data: {
					following: {
						connect: {
							username: currentUserPage,
						},
					},
				}
			})
		}
		else {
			await db.User.update ({
				where: {
					username: locals.user.name
				},
				data: {
					following: {
						disconnect: {
							username: currentUserPage,
						},
					},
				}
			})
		}	
	}
}