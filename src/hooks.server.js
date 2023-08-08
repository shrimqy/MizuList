import { db } from './lib/server/database';

/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');

	if (!session) {
		// if there is no session load page as normal
		return await resolve(event);
	}

	// find the user based on the session
	const user = await db.user.findUnique({
		where: { userAuthToken: session },
		select: { username: true, role: true, id: true }
	});

	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = {
			id: user.id,
			name: user.username,
			role: user.role.name
		};
	}

	const response = await resolve(event);
	return response;
}
