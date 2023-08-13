// import { redirect } from '@sveltejs/kit/http';
import { db } from '$lib/server/database';
import path from 'path';
import fs from 'fs';

let username, avatar;

export async function load(locals) {
	// let userData = null;
	// if (locals && locals.locals.user && locals.locals.user.name) {
	// 	const username = locals.locals.user.name;
	// 	const user = await db.user.findUnique({
	// 		where: { username }
	// 	});
	// 	if (user && user.avatar) {
	// 		const avatarBuffer = user.avatar; // Assuming the avatar property is the Buffer
	// 		const avatarDataUrl = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
	// 		userData = {
	// 			...user,
	// 			avatar: avatarDataUrl
	// 		};
	// 	}
	// }
	// return {
	// 	userData
	// };
}

export const actions = {
	updateAvatar: async ({ request, locals }) => {
		// Redirect if not logged in
		if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}

		const id = locals.user.id;

		const data = await request.formData();
		const imageFile = data.get('avatar');

		// Path to the file
		const uploadDirectory = path.resolve('static/uploads');
		// Create the directory if it doesn't exist
		if (!fs.existsSync(uploadDirectory)) {
			fs.mkdirSync(uploadDirectory, { recursive: true });
		}

		// Generate a unique filename for the image
		const filename = `${id}.png`;
		const filePath = path.join(uploadDirectory, filename);

		// Check if the file already exists
		if (fs.existsSync(filePath)) {
			// Remove the existing file
			fs.unlinkSync(filePath);
		}

		// Read the contents of the File object and convert it to a Buffer
		const fileBuffer = await imageFile.arrayBuffer();
		const buffer = Buffer.from(fileBuffer);

		// Save the image file to the specified location
		await fs.promises.writeFile(filePath, buffer);

		// Now you can store the filePath in the database or use it as needed
		await db.User.update({
			where: { id },
			data: { avatar: filePath }
		});
	},

	updateBio: async ({ request, locals }) => {
		const username = locals.user.name;
		const data = await request.formData();
		const bio = data.get('bio');
		const user = await db.user.findUnique({
			where: { username }
		});
		await db.User.update({
			where: { username },
			data: { bio: bio }
		});
	}
};
