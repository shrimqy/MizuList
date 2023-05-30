import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, bookId, isbn, work;
let fav,
	existingBook = null;

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	const fetchBook = async (id) => {
		bookId = await params.bookId;
		const workres = await fetch(`https://openlibrary.org/works/${bookId}.json`);
		work = await workres.json();
		const bookres = await fetch(`https://openlibrary.org/search.json?title=${work.title}&limit=18`);
		const bookData = await bookres.json();

		const matchingBooks = bookData.docs.filter((book) => book.key === work.key);

		let isbn = null;
		if (matchingBooks.length > 0 && matchingBooks[0].isbn && matchingBooks[0].isbn.length > 0) {
			const isbnData = await fetch(`https://openlibrary.org/isbn/${matchingBooks[0].isbn[0]}.json`);
			isbn = await isbnData.json();
		}
		// console.log(isbn);

		return {
			work,
			matchingBooks,
			isbn
		};
	};

	const fetchDb = async () => {
		if (locals && locals.user && locals.user.name) {
			username = locals.user.name;
			fav = await db.fav.findFirst({
				where: {
					bookId,
					User: {
						some: { username }
					}
				}
			});

			existingBook = await db.book.findFirst({
				where: {
					bookId,
					User: {
						some: { username }
					}
				},
				include: {
					bookCategory: true
				}
			});
		}

		const isBookIdFound = fav !== null;
		return {
			isBookIdFound,
			existingBook
		};
	};

	const result = await fetchBook();
	const resultdb = await fetchDb();
	return {
		work: result.work,
		bookData: result.matchingBooks[0],
		isbn: result.isbn,
		favTag: resultdb.isBookIdFound,
		existingBook: resultdb.existingBook
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
		const user = await db.user.findUnique({
			where: { username }
		});

		//checking if the book already exists in the DB
		const existingFav = await db.fav.findFirst({
			where: {
				bookId
			}
		});

		//if it does, update the record with the user else create the record with bookId and connec the user.
		if (existingFav) {
			await db.fav.update({
				where: { id: existingFav.id }, // Provide the unique identifier of the existing record
				data: {
					User: {
						connect: { id: user.id }
					}
				}
			});
		} else {
			await db.fav.create({
				data: {
					bookId: bookId,
					User: {
						connect: { id: user.id }
					}
				}
			});
		}
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
		const rating = data.get('rating');
		const status = data.get('status');
		const categoryId = parseInt(status, 10); //to convert the status to Int, shit doesn't work otherwise for somereason
		const chapters = data.get('chapters');
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
		const user = await db.user.findUnique({
			where: { username }
		});

		// Creating/updating the userStatus
		if (existingBook) {
			await db.Book.update({
				where: { id: existingBook.id }, // Provide the unique identifier of the existing record
				data: {
					bookId: bookId,
					title: work.title,
					pages: pages,
					chapters: chapters,
					rating: rating,
					rereads: rereads,
					completedAt: completedDateTime,
					createdAt: startedDateTime,
					covers: work.covers[0],
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
					bookId: bookId,
					title: work.title,
					pages: pages,
					chapters: chapters,
					rating: rating,
					rereads: rereads,
					completedAt: completedDateTime,
					covers: work.covers[0],
					// tPages: isbn.pages,
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
		await db.activity.create({
			data: {
				bookId: bookId,
				title: work.title,
				pages: pages,
				rating: rating,
				userId: user.id,
				covers: work.covers[0],
				categoryId: categoryId
			}
		});
	}
};
