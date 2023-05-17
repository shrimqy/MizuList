import { db } from '../../../lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {};
};

/** @type {import('./$types').Actions} */
export const actions = {
    addFav: async (req) => {
        console.log(req.params.bookId);
    }
};