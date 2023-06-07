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
		const bookres = await fetch(`https://openlibrary.org/search.json?title=${work.title}&limit=6`);
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
