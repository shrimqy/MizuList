import { db } from '../../../lib/server/database.js';

const cache = {
	data: null,
	timestamp: null,
	expirationTime: 60 * 5000 // Cache expiration time in milliseconds (e.g., 1 minute)
};

export const prerender = true;
export const load = async ({ fetch }) => {
	let dbBook = await db.book.findMany({
		distinct: ['englishTitle']
	})
	console.log(dbBook);
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
			dbBook
		};
	};

	const book = await fetchBook();

	return {
		book,
		dbBook: dbBook
	};
};
