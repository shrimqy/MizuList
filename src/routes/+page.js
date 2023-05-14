export const load = ({ fetch }) => {
    //to fetch the trending books from the api
    const fetchBook = async () => {
        const res = await fetch(`https://openlibrary.org/trending/monthly.json?&limit=18`);
        const book = await res.json();
        return book
    }
    return {
        book: fetchBook() //returning the fetchBook function as book prop to the +page.svelte
    }
}


