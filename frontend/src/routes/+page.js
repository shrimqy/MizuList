export const load = ({ fetch }) => {
    const fetchBook = async () => {
        const res = await fetch(`https://openlibrary.org/trending/monthly.json?&limit=18`);
        const book = await res.json();
        return book
    }
    return {
        book: fetchBook()
    }
}


