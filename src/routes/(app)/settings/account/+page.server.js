/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database'; //database import
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
export async function load() {
	return {};
}
export const actions = {
	updateUsername: async ({ request, locals }) => {
		const username = locals.user.name;
		const data = await request.formData();
		const newusername = data.get('username');
		if (typeof newusername !== 'string') {
			return fail(400, { invalid: true });
		}
		await db.user.update({
			where: { username: username },
			data: {
				username: newusername
			}
		});
		throw redirect(302, '/settings/account');
	},
	updatePassword: async ({ request, locals }) => {
		const username = locals.user.name;
		const data = await request.formData();
		const newpassword = data.get('password');
		if (typeof newpassword !== 'string') {
			return fail(400, { invalid: true });
		}
		await db.user.update({
			where: { username: username },
			data: {
				passwordHash: await bcrypt.hash(newpassword, 10)
			}
		});
	}
};
