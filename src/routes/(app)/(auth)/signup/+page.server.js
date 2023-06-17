import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/database';

var Roles; //defining enum
(function (Roles) {
	Roles['ADMIN'] = 'ADMIN';
	Roles['USER'] = 'USER';
})(Roles || (Roles = {})); //ensuring the object is defined

export const load = async ({ locals }) => {
	// redirect user if logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};
export const actions = {
	signup: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
			return fail(400, { invalid: true });
		}
		const user = await db.user.findUnique({
			where: { username } //fetching usernames from the db
		});

		//checking if the username already exists
		if (user) {
			return fail(400, { user: true }); //returning 'true' if found
		}

		//creating user
		await db.user.create({
			data: {
				username,
				passwordHash: await bcrypt.hash(password, 10),
				userAuthToken: crypto.randomUUID(),
				role: { connect: { id: 2 } },
				bookCategory: {
					connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }]
				}
			}
		});
		throw redirect(303, '/login');
	}
};
