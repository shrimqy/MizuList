/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';
export const prerender = true;
let username, bookId;
let fav,
	existingBook = null;

export async function load(locals) {
	let userData = null;
	console.log(locals.locals.user.name);
	if (locals && locals.locals.user && locals.locals.user.name) {
		username = locals.locals.user.name;
		const user = await db.user.findUnique({
			where: { username }
		});

		fav = await db.fav.findMany({
			where: {
				bookId,
				User: {
					some: { username }
				}
			}
		});
		existingBook = await db.book.findMany({
			where: {
				User: {
					some: { username }
				}
			},
			include: {
				bookCategory: true
			}
		});
		if (user && user.avatar) {
			const avatarBuffer = user.avatar; // Assuming the avatar property is the Buffer
			const avatarDataUrl = `data:image/png;base64,${avatarBuffer.toString('base64')}`;
			userData = {
				...user,
				avatar: avatarDataUrl
			};
		}
		// Attach bookCategory to each book
		existingBook = existingBook.map((book) => ({
			...book, // '...' allows to expand elements from an array or properties from an object
			bookCategory: book.bookCategory.map((category) => category.id)
		}));
	}
	return {
		existingBook,
		fav,
		userData
	};
}
