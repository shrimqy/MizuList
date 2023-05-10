export const load = ({ fetch, params }) => {
    const fetchBook = async () => {
        const res = await fetch(`https://openlibrary.org/search.json?title=${params.search}&limit=18`);
        const search = await res.json();
        return search;
    }
    return {
        search: fetchBook()
    }
}