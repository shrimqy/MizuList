import { db } from '../../../lib/server/database.js';

const cache = {
	data: null,
	timestamp: null,
	expirationTime: 60 * 5000 // Cache expiration time in milliseconds (e.g., 1 minute)
};

export const prerender = true;
export const load = async ({ fetch }) => {
	let allTimePopularBooks = await db.book.findMany({
		distinct: ['englishTitle'],
		orderBy: {
			userBooks: {
				_count: 'desc'
			}
		}
	})

	let topRatedBooks = await db.book.findMany({
		where: {
			publicRating: {
				not: null
			}
		},
		orderBy: {
			publicRating: 'desc'
		}
	});


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

	console.log(weeklyPopularBooks);
	const fetchBook = async () => {
		const currentTime = Date.now();

		// Check if cache exists and has not expired
		if (cache.data && cache.timestamp && currentTime - cache.timestamp < cache.expirationTime) {
			return cache.data;
		}

		const res = await fetch(`https://openlibrary.org/trending/monthly.json?&limit=18`);
		const book = await res.json();

		// Update cache with fetched data and current timestamp
		cache.data = book;
		cache.timestamp = currentTime;

		return {
			book,
		};
	};

	const book = await fetchBook();

	return {
		book,
		allTimePopularBooks,
		topRatedBooks,
		weeklyPopularBooks
	};
};
