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
		
		const currentUserRecommendation = await db.recommendation.findFirst({
			where: {
				id: id
			},
			include: {
				Like: {
					where: {
						User: {
							is: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				},
				DisLike: {
					where: {
						User: {
							is: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				}
			}
		})

		if (!currentUserRecommendation.Like[0]) {
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
		else {
			await db.Like.delete({
				where: {
					id: currentUserRecommendation.Like[0].id
				}
			})
		}
		if (currentUserRecommendation.DisLike[0]) {
			await db.DisLike.delete({
				where: {
					id: currentUserRecommendation.DisLike[0].id
				}
			})
		}
	},

	dislike: async ({ request, locals }) => {
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		username = locals.user.name;
		const data = await request.formData();
		const id = data.get('id');
		
		const currentUserRecommendation = await db.recommendation.findFirst({
			where: {
				id: id
			},
			include: {
				Like: {
					where: {
						User: {
							is: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				},
				DisLike: {
					where: {
						User: {
							is: { id: locals.user.id}
						}
					},
					select: {
						id: true,
					}
				}
			}
		})

		if (!currentUserRecommendation.DisLike[0]) {
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
		else {
			await db.DisLike.delete({
				where: {
					id: currentUserRecommendation.DisLike[0].id
				}
			})
		}
		if (currentUserRecommendation.Like[0]) {
			await db.Like.delete({
				where: {
					id: currentUserRecommendation.Like[0].id
				}
			})
		}
	}
};



// like: async ({ request, locals }) => {
// 	if (!(locals && locals.user && locals.user.name)) {
// 		throw redirect(302, '/login');
// 	}
// 	username = locals.user.name;
// 	const data = await request.formData();
// 	const id = data.get('id');
// 	const user = await db.user.findUnique({
// 		where: { username }
// 	});

// 	const recommendation = await db.Recommendation.findUnique({
// 		where: { id },
// 		include: {
// 			Like: {
// 				select: {
// 					id: true,
// 				}
// 			},
// 			DisLike: {
// 				select: {
// 					id: true,
// 				}
// 			}
// 		}
// 	});

// 	const currentUserLike = await db.Like.findFirst({
// 		where: {
// 			recommendationId: id,
// 			user: {
// 				some: { username: username }
// 			},
// 		}
// 	})

// 	const currentUserRecommendation = await db.recommendation.findFirst({
// 		where: {
// 			id: id
// 		},
// 		include: {
// 			Like: {
// 				where: {
// 					user: {
// 						some: { id: user.id}
// 					}
// 				},
// 				select: {
// 					id: true,
// 				}
// 			},
// 			DisLike: {
// 				where: {
// 					user: {
// 						some: { id: user.id}
// 					}
// 				},
// 				select: {
// 					id: true,
// 				}
// 			}
// 		}
// 	})

// 	if (recommendation.Like[0] == null) {
// 		console.log("create");
// 		await db.Recommendation.update({
// 			where: { id: recommendation.id },
// 			data: {
// 				Like: {
// 					create: 
// 						{
// 							user: { connect: { id: user.id } },
// 						}
// 				}
// 			}
// 		})
// 	} else if(currentUserLike) {
// 		await db.Recommendation.update({
// 			where: { id: recommendation.id },
// 			data: {
// 				Like: {
// 					update: 
// 						{
// 							where: { id: recommendation?.Like[0]?.id },
// 							data: {
// 								user: { disconnect: { id: user.id } },
// 							}
// 						}
// 				}
// 			}
// 		})
// 	} else {
// 		await db.Recommendation.update({
// 			where: { id: recommendation.id },
// 			data: {
// 				Like: {
// 					update: 
// 						{
// 							where: { id: recommendation?.Like[0]?.id },
// 							data: {
// 								user: { connect: { id: user.id } },
// 							}
// 						}
// 				}
// 			}
// 		})
// 	}

// 	if (currentUserRecommendation.DisLike[0]) {
// 		await db.Recommendation.update({
// 			where: { id: recommendation.id },
// 			data: {
// 				DisLike: {
// 					update: 
// 						{
// 							where: { id: currentUserRecommendation.DisLike[0]?.id },
// 							data: {
// 								user: { disconnect: { id: user.id } },
// 							}
// 						}
// 				}
// 			}
// 		})
// 	}
// },
