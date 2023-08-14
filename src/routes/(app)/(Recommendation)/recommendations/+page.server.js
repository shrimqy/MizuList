/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username;
let existinglike, existingdislike;
export async function load() {
	const recommendations = await db.Recommendation.findMany({
		include: {
			Like: {
				include: {
					User: {
						select: {
							id: true
						}
					}
				}
			},
			disLike: {
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
		recommendations
	};
}
export const actions = {
	like: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');
		const user = await db.user.findUnique({
			where: { username }
		});

		const recommendations = await db.Recommendation.findUnique({
			where: { id }
		});

		if (recommendations !== null) {
			existinglike = await db.Like.findFirst({
				where: { recommendationId: recommendations.id },
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
						where: { recommendationId: recommendations.id },
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
						recommendationId: recommendations.id
					}
				});
			}
			existingdislike = await db.disLike.findFirst({
				where: { recommendationId: recommendations.id },
				include: { User: true }
			});
			if (existingdislike) {
				if (existingdislike.User.some((u) => u.username === username)) {
					await db.disLike.update({
						where: { id: existingdislike.id },
						data: {
							User: {
								// Disconnect the User record using the id
								disconnect: { id: user.id }
							}
						}
					});
				}
			}
		}
	},

	dislike: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');
		const user = await db.user.findUnique({
			where: { username }
		});

		const recommendations = await db.Recommendation.findUnique({
			where: { id }
		});

		if (recommendations !== null) {
			existingdislike = await db.disLike.findFirst({
				where: { recommendationId: recommendations.id },
				include: { User: true }
			});
			if (existingdislike) {
				if (existingdislike.User.some((u) => u.username === username)) {
					await db.disLike.update({
						where: { id: existingdislike.id },
						data: {
							User: {
								// Disconnect the User record using the id
								disconnect: { id: user.id }
							}
						}
					});
				} else {
					existingdislike = await db.disLike.findFirst({
						where: { recommendationId: recommendations.id },
						include: { User: true }
					});
					await db.disLike.update({
						where: { id: existingdislike.id },
						data: {
							User: {
								// Connect the User record using the id
								connect: { id: user.id }
							}
						}
					});
				}
			} else {
				await db.disLike.create({
					data: {
						User: {
							// Connect the User record using the id
							connect: { id: user.id }
						},
						recommendationId: recommendations.id
					}
				});
			}
			existinglike = await db.Like.findFirst({
				where: { recommendationId: recommendations.id },
				include: { User: true }
			});
			if (existinglike && existingdislike) {
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
				}
			}
		}
	}
};
