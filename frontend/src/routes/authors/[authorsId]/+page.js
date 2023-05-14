/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params }) => {
    const fetchBook = async (id) => {
        const res = await fetch(`https://openlibrary.org/authors/${id}/works.json?sort=editions&limit=100`);
        const authors = await res.json();
        console.log(authors);
        return authors
    }
    return {
        authors: fetchBook(params.authorsId)
    }
}


