/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
let lastActivity, userData;
export async function load(locals) {
	let username = locals.user?.name;
	if (username) {
		userData = await db.user.findUnique({
			where: { username }
		});
	}
	lastActivity = await db.activity.findMany({
		orderBy: {
			timestamp: 'desc'
		},
		include: {
			category: true,
			user: true
		}
	});
	return {
		lastActivity: lastActivity.slice(0, 20),
		userData: userData
	};
}
