/** @type {import('./$types').PageServerLoad} */

import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/database';



export async function load() {
    return {};
};

export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            !username ||
            !password
        ) {
            return fail(400, { invalid: true });
        }

        const user = await db.user.findUnique({
            where: { username }, //fetching usernames from the db
        });

        //checking if the username already exists
        if (!user) {
            return fail(400, { credentials: true }); //returning 'true' if found
        }

        const userPassword = await bcrypt.compare(password, user.passwordHash)

        if(!userPassword) {
            return fail(400, { credentials: true })
        }

        const authenticatedUser = await db.user.update({
            where: { username: user.username },
            data: { userAuthToken: crypto.randomUUID() }
        })

        cookies.set('session', authenticatedUser.userAuthToken, {
            // send cookie for every page
            path: '/',
            // server side only cookie so you can't use `document.cookie` (for security)
            httpOnly: true,
            // only requests from same site can send cookies (also for security)
            sameSite: 'strict',
            // only sent over HTTPS in production 
            secure: process.env.NODE_ENV == 'production', 
            // setting cookie to expire after a month
            maxAge: 60 * 24 * 30,
        })

        throw redirect(302, '/')
    }
}