import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
import { log } from 'console';
let username, bookId, isbn, work, matchingBooks;
let userBook = null, userFavorite = null, favorite = null
let book;
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	bookId = await params.bookId;
	if (!bookId) {
		throw redirect('/');
	}
	
	if (locals && locals.user && locals.user.id) {
		username = locals?.user?.name;
		const userID = locals?.user?.id

		userFavorite = await db.Favorite.findFirst({
			where: {
				bookID: bookId,
				user: {
					some: { username }
				}
			}
		});

		favorite = await db.Favorite.findFirst({
			where: {
				bookID: bookId
			},
			include: {
				user: true
			}
		});
		userBook = await db.UserBook.findUnique({
			where: {
				userID_bookID: {
					userID: userID,
					bookID: bookId
				}
			},
			include: { 
				bookCategory: true
			}
		});
	}
	
	book = await db.book.findUnique({
		where: {
			id: bookId
		},
		include: {
			SeriesBook: {
				include: {
					series: true
				}
			},
			genres: true,
			tag: true,
			userBooks: {
				include: {
					bookCategory: true
				}
			},
			review: {
				include: {
					user: true
				}
			}
		}
	});

	let recommendations = await db.recommendation.findMany({
        where: {
            OR: [
                { book1Id: bookId },
                { book2Id: bookId }
            ]
        },
        include: {
            Like: true,
			book1: {
				select: {
					id: true,
					coverUrl: true,
					englishTitle: true
				}
			},
			book2: {
				select: {
					id: true,
					coverUrl: true,
					englishTitle: true
				}
			}
        },
        orderBy: {
            Like: {
                _count: 'desc'
            }
        }
    });

	await db.book.update({
		where: {
			id: bookId
		},
		data: {
			views: book.views+1
		}
	})

	const userFavoriteKEY =  userFavorite!== null



	return {
		book: book,
		userBook: userBook,
		favorite: favorite,
		userFavorite: userFavorite,
		favorite: favorite,
		userFavoriteKEY: userFavoriteKEY,
		recommendations: recommendations
	};
}
/** @type {import('./$types').Actions} */
export const actions = {
	//add to favorite Action definiion

	addFav: async ({ locals }) => {
		//throw redirect to login if user isn't logged in
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		const user = await db.User.findUnique({
			where: { username }
		});

		// if it does, update the record with the user else create the record with bookId and connec the user.
		if (userFavorite) {
			console.log("if");
			await db.Favorite.update({
				where: { id: favorite.id }, // Provide the unique identifier of the existing record
				data: {
					user: { disconnect: { id: user.id } }
				}
			});
		} else if (favorite) {
			console.log("else if");
			await db.Favorite.update({
				where: { id: favorite.id }, // Provide the unique identifier of the existing record
				data: {
					user: { connect: { id: user.id } }
				}	
			});
		} else {
			console.log("else");
			await db.Favorite.create({
				data: {
					book: { connect: { id: bookId } },
					user: { connect: { id: user.id } }
				}	
			});
		}
		return { success: true };
	},

	//Add to List Function
	userStatus: async ({ request, params, locals }) => {
		//redirect if mot logged in
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
		//getting form data
		const bookId = await params.bookId;
		const data = await request.formData();
		let rating = data.get('rating');
		if (rating === '0') {
			rating = null;
		}
		const status = data.get('status');
		const categoryId = parseInt(status, 10); //to convert the status to Int, shit doesn't work otherwise for somereason
		const chapters = data.get('chapters');
		const pages = data.get('pages');
		const rereads = data.get('rereads');
		const notes = data.get('notes');

		const startedAt = data.get('startDate');
		let startedDateTime = null
		if (startedAt) {
			startedDateTime = new Date(startedAt).toISOString()
		}
		const completedAt = data.get('finishDate');
		let completedDateTime = null;
		if (completedAt) {
			completedDateTime = new Date(completedAt).toISOString();
		}
		const user = await db.user.findUnique({
			where: { username }
		});

		const existingBook = await db.userBook.findFirst({
			where: { 
				userID: user.id,
				bookID: bookId
			}
		})

		//Creating activity
		//only updating when there is any change in the data in condition
		if (
			existingBook?.rating !== rating ||
			existingBook?.pages !== pages ||
			existingBook?.chapters !== chapters ||
			existingBook?.bookCategory[1].id !== categoryId ||
			existingBook?.rereads !== rereads
		) {
			await db.activity.create({
				data: {
					bookID: bookId,
					title: book.englishTitle,
					chapter: chapters,
					pages: pages,
					rating: rating,
					userID: user.id,
					categoryId: categoryId
				}
			});
		}

		const ratings = await db.userBook.findMany({
			where: {
				bookID: bookId,
				rating: {
					not: null  
				} 
			},
			select: {
				rating: true
			}
		});
		const ratingCount = ratings.length
		const sumOfRatings = ratings.reduce((total, userBook) => total + parseInt(userBook.rating), 0);
		console.log(existingBook);
		const avgRating = ratingCount > 0 ? sumOfRatings / ratingCount : 0;

		// Creating/updating the userStatus
		if (existingBook) {
			await db.Book.update({
				where: { id: bookId },
				data: { 
					publicRating: avgRating,
					ratingCount: ratingCount,
					userBooks: {
						update: 
							{
								where: { 
									userID_bookID: {
										userID: locals.user.id,
										bookID: bookId
									}
								},
								data: {
									pagesRead: pages,
									chaptersRead: chapters,
									rating: rating,
									rereads: rereads,
									startedDate: startedDateTime,
									notes: notes,
									completedAt: completedDateTime,
									bookCategory: {
										// Disconnecting the category at index 1 from the existing book's categories
										disconnect: [{ id: userBook?.bookCategory[1]?.id }],
				
										// Connecting the new category and the "All" category to the book
										connect: [{ id: categoryId }, { id: 1 }]
									},
								}
							}
					}
				}
			})
		} else {
			await db.Book.update({
				where: { id: bookId },
				data: {
					publicRating: avgRating,
					ratingCount: ratingCount,
					userBooks: {
						create: [
							{
								user: {
									connect: { id: user.id }
								},
								pagesRead: pages,
								chaptersRead: chapters,
								rating: rating,
								rereads: rereads,
								startedDate: startedDateTime,
								completedAt: completedDateTime,
								bookCategory: {
									// Connecting the new category and the "All" category to the book
									connect: [{ id: categoryId }, { id: 1 }]
								},
							}
						]	
					}
				},
			});
		}

		return { success: true };
	}
};
