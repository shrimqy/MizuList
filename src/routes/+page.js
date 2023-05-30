const cache = new Map();

export const load = async ({ fetch }) => {
	const fetchBook = async () => {
		if (cache.has('trendingBooks')) {
			return cache.get('trendingBooks');
		}

		const res = await fetch(`https://openlibrary.org/trending/monthly.json?&limit=18`);
		const book = await res.json();

		cache.set('trendingBooks', book);

		return book;
	};

	const book = await fetchBook();

	return {
		book
	};
};
