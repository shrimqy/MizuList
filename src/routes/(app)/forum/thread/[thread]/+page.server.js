import { db } from '../../../../../lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({params, local}) {
    const thread = await db.thread.findUnique({
        where: { id: params.thread},
        include:{
            Comment: true,
            category: true,
            book: true,
            user: true
        }
    })
    return {
        thread: thread
    };
};