/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
export async function load({ params, parent }) {
	await parent;
	const username = params.profileId;
	const reviews = await db.reviews.findMany({
		where: {
			user: {
				is: { username }
			}
		},
		include: {
			user: true
		}
	});
	const fetchPromises = reviews.map(async (review) => {
		const workres = await fetch(`https://openlibrary.org/works/${review.bookId}.json`);
		const work = await workres.json();
		return work;
	});

	const workData = await Promise.all(fetchPromises);
	return {
		reviews,
		workData
	};
}
