/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
let lastActivity, userData, existingBook, username, status;
export async function load(locals) {
	username = locals.locals.user?.name;
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
			user: true,
			Like: {
				include: {
					User: {
						select: {
							id: true
						}
					}
				}
			}
		}
	});

	status = await db.status.findMany({
		orderBy: {
			timestamp: 'desc'
		},
		include: {
			user: true,
			Like: {
				include: {
					User: {
						select: {
							id: true
						}
					}
				}
			}
		}
	});
	return {
		lastActivity: lastActivity.slice(0, 20),
		userData: userData,
		existingBook,
		status
	};
}
/** @type {import('./$types').Actions} */
export const actions = {
	activityStatus: async ({ request, locals, params }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const user = await db.user.findUnique({
			where: { username }
		});

		const data = await request.formData();
		const textData = data.get('text');
		await db.status.create({
			data: {
				userId: user.id,
				activityText: textData
			}
		});
		return { success: true };
	},

	like: async ({ request, locals, params }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const data = await request.formData();
		const id = data.get('id');
		console.log(id);
		const user = await db.user.findUnique({
			where: { username }
		});

		const existingActivity = await db.activity.findUnique({
			where: { id }
		});

		const existingStatus = await db.status.findUnique({
			where: { id }
		});
		let existinglike;
		if (existingActivity !== null) {
			existinglike = await db.Like.findFirst({
				where: { activityId: existingActivity.id },
				include: { User: true }
			});

			if (existinglike) {
				if (existinglike.User.some((u) => u.username === username)) {
					await db.Like.update({
						where: { id: existinglike.id },
						data: {
							User: {
								// Disconnect the User record using the id
								disconnect: { id: user.id }
							}
						}
					});
				} else {
					existinglike = await db.Like.findFirst({
						where: { activityId: existingActivity.id },
						include: { User: true }
					});
					await db.Like.update({
						where: { id: existinglike.id },
						data: {
							User: {
								// Connect the User record using the id
								connect: { id: user.id }
							}
						}
					});
				}
			} else {
				await db.Like.create({
					data: {
						User: {
							// Connect the User record using the id
							connect: { id: user.id }
						},
						activityId: existingActivity.id
					}
				});
			}
		} else if (existingStatus) {
			existinglike = await db.Like.findFirst({
				where: { statusId: existingStatus.id },
				include: { User: true }
			});
			if (existinglike) {
				if (existinglike.User?.some((u) => u.username === username)) {
					console.log('update some');
					await db.Like.update({
						where: { id: existinglike.id },
						data: {
							User: {
								// Disconnect the User record using the id
								disconnect: { id: user.id }
							}
						}
					});
				} else {
					await db.Like.update({
						where: { id: existinglike?.id },
						data: {
							User: {
								// Connect the User record using the id
								connect: { id: user.id }
							}
						}
					});
				}
			} else {
				await db.Like.create({
					data: {
						User: {
							// Connect the User record using the id
							connect: { id: user.id }
						},
						statusId: existingStatus.id
					}
				});
			}
		}
		return { success: true };
	}
};
