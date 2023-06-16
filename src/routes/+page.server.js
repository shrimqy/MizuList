/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
let lastActivity;
export async function load() {
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
		lastActivity: lastActivity.slice(0, 20)
	};
}
