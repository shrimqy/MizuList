import { db } from '$lib/server/database.js';

const cache = {
	data: null,
	timestamp: null,
	expirationTime: 60 * 5000 // Cache expiration time in milliseconds (e.g., 1 minute)
};

export const load = async ({ fetch }) => {
	let allTimePopularBooks = await db.book.findMany({
		orderBy: {
			userBooks: {
				_count: 'desc'
			}
		}
	});
	return {
		allTimePopularBooks: allTimePopularBooks,
	};
};

export const actions = {
	search: async ({request}) => {
		const data = await request.formData()
        const searchTerm = data.get("search")
		const search = await db.book.findMany({
			where: {
				englishTitle: {
					contains: searchTerm,
					mode: 'insensitive'
				}	
			}
		})
		return { search: search}
	}
}