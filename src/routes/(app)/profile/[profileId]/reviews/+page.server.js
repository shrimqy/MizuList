/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
export async function load({ params, parent }) {
	await parent;
	const username = params.profileId;
	const reviews = await db.review.findMany({
		where: {
			user: {
				is: { username }
			}
		},
		include: {
			user: true,
			book: true
		}
	});
	return {
		reviews,
	};
}
