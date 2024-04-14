import { db } from '../../../../../lib/server/database';
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890', 10)

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    
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
		return { searchRes: search}
	},

	newEntry: async ({request, locals}) => {
		const data = await request.formData()
		const books = data.getAll("book")
		const text = data.get("message")
		const title = data.get("title")
		const category = parseInt(data.get("category")) 
		
		await db.thread.create({
			data: {
				id: nanoid(),
				title: title,
				threadBody: text,
				book: {
					connect: books.map(id => ({ id }))
				},
				category: {
					connect: { 
						id: category
					}
				},
				userID: locals.user.id,
			}
		});
	}
}