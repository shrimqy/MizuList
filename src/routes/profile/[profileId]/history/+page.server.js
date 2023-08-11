/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
let username, fav, lastActivity, stats;

export async function load({ locals, params, parent }) {
	await parent;
	username = params.profileId;
	const user = await db.user.findUnique({
		where: { username }
	});
	lastActivity = await db.activity.findMany({
		where: {
			userId: {
				equals: user.id
			}
		},
		orderBy: {
			timestamp: 'desc'
		},
		include: {
			category: true
		}
	});

	return {
		lastActivity
	};
}
