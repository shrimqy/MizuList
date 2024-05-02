/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
export async function load({ locals }) {
    let userSocials = await db.User.findUnique ({
		where: {
			username: locals.user.name
		},
		select: {
			following: true,
            followedBy: true
		}
	})
    return { userSocial: userSocials };
};