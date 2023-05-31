// import { redirect } from '@sveltejs/kit/http';
import { db } from '$lib/server/database';

let username, avatar;

export async function load(locals) {
	let userData = null;

	if (locals && locals.locals.user && locals.locals.user.name) {
		const username = locals.locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});

		if (user && user.avatar) {
			const avatarBuffer = user.avatar; // Assuming the avatar property is the Buffer
			const avatarDataUrl = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
			userData = {
				...user,
				avatar: avatarDataUrl
			};
		}
	}

	return {
		userData
	};
}
export const actions = {
	updateAvatar: async ({ request, locals }) => {
		// Redirect if not logged in
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}

		username = locals.user.name;

		const data = await request.formData();
		const imageFile = data.get('avatar');
		console.log(imageFile);
		// Convert the image file to a Buffer
		const imageBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(imageBuffer);

		// Store the image buffer in the database
		await db.user.update({
			where: { username },
			data: { avatar: buffer }
		});

		// await db.user.update({
		// 	where: { username },
		// 	data: { avatar: imageFile }
		// });
	}
};
