/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database'; //database import
import { redirect } from '@sveltejs/kit';

const cache = {
	data: null,
	timestamp: null,
	expirationTime: 60 * 5000 // Cache expiration time in milliseconds (e.g., 1 minute)
};

let lastActivity, userData, existingBook, username, status;
export async function load(locals) {
	username = locals.locals?.user?.name;

	//finding books from the user
	if (username) {
		userData = await db.user.findUnique({
			where: { username }
		});
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
						authors: true,
						coverUrl: true,
						chapters: true,
					}
				}
			}
		});

		// Attach bookCategory to each book
		existingBook = existingBook.map((book) => ({
			...book, // '...' allows to expand elements from an array or properties from an object
			bookCategory: book.bookCategory.map((category) => category.id)
		}));
	}

	//Fetching activity list
	lastActivity = await db.activity.findMany({
		take: 20,
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
			},
			book: true
		}
	});

	//fetching status updates
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


	const fetchBook = async () => {
		// Construct the Prisma query to find books updated in the last week
		const weeklyPopularBooks = await db.book.findMany({
			where: {
				userBooks: {
					some: {
						lastUpdated: {
							gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
						}
					}
				}
			},
			orderBy: {
				userBooks: {
					_count: 'desc'
				}
			}
		});	

		return weeklyPopularBooks;
	};

	const weeklyPopularBooks = await fetchBook();

	return {
		lastActivity: lastActivity,
		userData: userData,
		existingBook,
		status,
		weeklyPopularBooks
	};
}
/** @type {import('./$types').Actions} */

//action definitions
export const actions = {
	//status action
	activityStatus: async ({ request, locals, params }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const user = await db.user.findUnique({
			where: { username }
		});

		const data = await request.formData();
		const textData = data.get('text');

		//creates a new status
		await db.status.create({
			data: {
				userID: user.id,
				text: textData
			}
		});
		return { success: true };
	},

	activityLike: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}

		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');
		const existingActivity = await db.activity.findUnique({
			where: {
				id: id
			},
			include: {
				Like: true
			}

		})
		let existingUserLike
		if (existingActivity.Like) {
			existingUserLike = await db.activity.findFirst({
				where: {
					id: id
				},
				include: {
					Like: {
						where: {
							User: {
								some: { id: locals.user.id}
							}
						},
						select: {
							id: true,
						}
					},
				}
			})
			if (existingUserLike.Like) {
				await db.Like.update({
					where: {
						id: existingActivity.Like.id
					},
					data: {
						User: {
							disconnect: { id: locals.user.id }
						}
					}
				})
			} else {
				await db.Like.update({
					where: {
						id: existingActivity.Like.id
					},
					data: {
						User: {
							connect: { id: locals.user.id }
						}
					}
				})
			}
		} else {
			await db.Like.create({
				data: {
					activity: {
						connect: { id: id }
					},
					User: {
						connect: { id: locals.user.id}
					}
				}
			})
		}
		return { success: true };
	},

	statusLike: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}

		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');

		const existingStatus = await db.status.findUnique({
			where: {
				id: id
			},
			include: {
				Like: true
			}

		})
		let existingUserLike;
		if (existingStatus.Like) {
			existingUserLike = await db.status.findFirst({
				where: {
					id: id
				},
				include: {
					Like: {
						where: {
							User: {
								some: { id: locals.user.id}
							}
						},
						select: {
							id: true,
						}
					},
				}
			})
			if (existingUserLike.Like) {
				await db.Like.update({
					where: {
						id: existingStatus.Like.id
					},
					data: {
						User: {
							disconnect: { id: locals.user.id }
						}
					}
				})
			} else {
				await db.Like.update({
					where: {
						id: existingStatus.Like.id
					},
					data: {
						User: {
							connect: { id: locals.user.id }
						}
					}
				})
			}
		} else {
			await db.Like.create({
				data: {
					status: {
						connect: { id: id }
					},
					User: {
						connect: { id: locals.user.id}
					}
				}
			})
		}
		return { success: true };
	}
};
