import { db } from '../../../lib/server/database';

let threads = null
/** @type {import('./$types').PageServerLoad} */
export async function load() {
    threads = await db.thread.findMany({
        take: 10,
        include: {
            book: true,
            Comment: true,
            category: true
        }
    })
    return {
        threads: threads
    };
};

export const actions = {
    feedSelection: async ({request}) => {
		const data = await request.formData()
        const feedSelection = data.get('feedSelection')
        if (feedSelection == 0) {
            threads = await db.thread.findMany({
                take: 6,
                orderBy: {
                    lastUpdated: 'desc'
                },
                include: {
                    book: true,
                    Comment: true,
                    category: true
                }
            })
        } else if (feedSelection == 1) {
            threads = await db.thread.findMany({
                take: 6,
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    NOT: {
                        isPinned: true
                    }
                },
                include: {
                    book: true,
                    Comment: true,
                    category: true
                }
            })
        } else {
            threads = await db.thread.findMany({
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    book: true,
                    Comment: true,
                    category: true
                }
            })
        }
		return { threads: threads }
	},

    search: async ({request}) => {
		const data = await request.formData()
        const searchTerm = data.get("search")
		const search = await db.thread.findMany({
			where: {
				title: {
					contains: searchTerm,
					mode: 'insensitive'
				},
                NOT: {
                    isPinned: true
                }	
			},
            include: {
                book: true,
                Comment: true,
                category: true
            }
		})
		return { search: search}
	}
}