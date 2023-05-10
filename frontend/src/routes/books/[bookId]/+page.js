export const load = ({ fetch, params }) => {
    const fetchBook = async (id) => {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);
        const book = await res.json();
        return book
    }
    return {
        book: fetchBook(params.bookId)
    }
}


