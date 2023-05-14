export const load = ({ fetch, params }) => {
    const fetchBook = async (id) => {
        const workres = await fetch(`https://openlibrary.org/works/${id}.json`);
        const work = await workres.json();
        const bookres = await fetch(`https://openlibrary.org/search.json?title=${work.title}&limit=18`)
        const book = await bookres.json();
        console.log(book);
        
        return work
    }
    return {
        book: fetchBook(params.bookId)
    }
}


