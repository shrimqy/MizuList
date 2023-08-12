/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
export async function load() {
	const recommendations = await db.Recommendation.findMany({});
	return {
		recommendations
	};
}
