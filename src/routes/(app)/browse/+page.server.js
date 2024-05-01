import { db } from '../../../lib/server/database.js';

const cache = {
	data: null,
	timestamp: null,
	expirationTime: 60 * 5000 // Cache expiration time in milliseconds (e.g., 1 minute)
};

export const load = async ({ fetch }) => {
	let allTimePopularBooks = await db.book.findMany({
		take: 6, 
		orderBy: {
			userBooks: {
				_count: 'desc'
			}
		}
	});
	
	let topRatedBooks = await db.book.findMany({
		take: 6, 
		where: {
			publicRating: {
				not: null
			}
		},
		orderBy: {
			publicRating: 'desc'
		}
	});
	
	const weeklyPopularBooks = await db.book.findMany({
		take: 6, 
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

	const newEntries = await db.book.findMany({
		take: 6,
		orderBy: {
			createdAt: 'desc'
		}
	})

	return {
		allTimePopularBooks: allTimePopularBooks,
		topRatedBooks: topRatedBooks,
		weeklyPopularBooks: weeklyPopularBooks,
		newEntries: newEntries
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