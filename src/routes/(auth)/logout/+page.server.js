//we only need the +page.server.js here since logout isn't a page in itself
/** @type {import('./$types').PageServerLoad} */
/** @type {import('./$types').Actions} */
import { redirect } from '@sveltejs/kit';

export async function load() { 
    throw redirect(302, '/')
};


export const actions = {
    default({ cookies }) {
        cookies.set('session', '', { //setting the cooking to blank
            path: '/',
            expires: new Date(0), //setting the cookie to expire at 0
        })

        throw redirect(302, '/')
    }
};