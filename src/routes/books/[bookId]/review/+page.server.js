let username;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {};
}
/** @type {import('./$types').Actions} */
export const actions = {
	//add to favorite Action definiion

	addFav: async ({ locals }) => {
		//throw redirect to login if user isn't logged in
		if (!(locals && locals.user && locals.user.name)) {
			username = locals.user.name;
			throw redirect(302, '/login');
		}
		const user = await db.user.findUnique({
			where: { username }
		});

		//checking if the book already exists in the DB
		const existingFav = await db.fav.findFirst({
			where: {
				bookId
			}
		});

		//if it does, update the record with the user else create the record with bookId and connec the user.
		if (existingFav) {
			await db.fav.delete({
				where: { id: existingFav.id } // Provide the unique identifier of the existing record
			});
		} else {
			await db.fav.create({
				data: {
					bookId: bookId,
					covers: work.covers[0],
					User: {
						connect: { id: user.id }
					}
				}
			});
		}
	}
};
