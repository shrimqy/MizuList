/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username;
let existinglike, existingdislike;
export async function load() {
	const recommendations = await db.Recommendation.findMany({
		include: {
			book1: {
				select: {
					coverUrl: true,
					englishTitle: true
				}
			},
			book2: {
				select: {
					coverUrl: true,
					englishTitle: true
				}
			},
			Like: {
				include: {
					User: {
						select: {
							id: true
						}
					}
				}
			},
			DisLike: {
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
		
		const existingRecommendation = await db.recommendation.findUnique({
			where: {
				id: id
			},
			include: {
				Like: true,
				DisLike: {
					where: {
						User: {
							some: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				}
			}

		})
		let existingUserLike
		if (existingRecommendation.Like) {
			existingUserLike = await db.recommendation.findFirst({
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
						id: existingRecommendation.Like.id
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
						id: existingRecommendation.Like.id
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
					recommendation: {
						connect: { id: id }
					},
					User: {
						connect: { id: locals.user.id}
					}
				}
			})
		}
		
		if (existingRecommendation.DisLike) {
			await db.disLike.update({
				where: { id: existingRecommendation.DisLike.id },
				data: {
					User: {
						// Disconnect the User record using the id
						disconnect: { id: locals.user.id }
					}
				}
			});
		}
		return { success: true };
	},

	dislike: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');
		
		const existingRecommendation = await db.recommendation.findUnique({
			where: {
				id: id
			},
			include: {
				DisLike: true,
				Like: {
					where: {
						User: {
							some: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				}
			}

		})
		let existingUserDisLike
		if (existingRecommendation.DisLike) {
			existingUserDisLike = await db.recommendation.findFirst({
				where: {
					id: id
				},
				include: {
					DisLike: {
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
			if (existingUserDisLike.DisLike) {
				await db.DisLike.update({
					where: {
						id: existingRecommendation.DisLike.id
					},
					data: {
						User: {
							disconnect: { id: locals.user.id }
						}
					}
				})
			} else {
				await db.DisLike.update({
					where: {
						id: existingRecommendation.DisLike.id
					},
					data: {
						User: {
							connect: { id: locals.user.id }
						}
					}
				})
			}
		} else {
			await db.DisLike.create({
				data: {
					recommendation: {
						connect: { id: id }
					},
					User: {
						connect: { id: locals.user.id}
					}
				}
			})
		}
		
		if (existingRecommendation.Like) {
			await db.Like.update({
				where: { id: existingRecommendation.Like.id },
				data: {
					User: {
						// Disconnect the User record using the id
						disconnect: { id: locals.user.id }
					}
				}
			});
		}
		return { success: true };
	}
};

