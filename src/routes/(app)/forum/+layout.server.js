/** @type {import('./$types').LayoutServerLoad} */
import { db } from '../../../lib/server/database';
import { customAlphabet } from 'nanoid'
export async function load() {
    const categories = await db.threadCategory.findMany({
        where: {
            NOT: {
                id: 10
            }
        }
    });
    return {
        categories: categories
    };
}