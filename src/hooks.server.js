import { db } from './lib/server/database';

/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {
    const session = event.cookies.get('session')

    if (!session) {
        return await resolve(event)
    }

    const user = await db.user.findUnique({
        where: { userAuthToken: session },
        select: { username: true, role: true }
    })

    if (user) {
        event.locals.user = {
            name: user.username,
            role: user.role.name,
        }
    }

    const response = await resolve(event);
    return response;
}