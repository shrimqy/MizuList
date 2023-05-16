export const load = async ({ fetch, params }) => {
    const fetchBook = async (id) => {
      const workres = await fetch(`https://openlibrary.org/works/${id}.json`);
      const work = await workres.json();
  
      const bookres = await fetch(
        `https://openlibrary.org/search.json?title=${work.title}&limit=18`
      );
      const bookData = await bookres.json();
  
      const matchingBooks = bookData.docs.filter((book) => book.key === work.key); // filter callback checks if the key property of each book matches the work.key value
  
      return {
        work,
        matchingBooks,
      };
    };
  
    const result = await fetchBook(params.bookId);
  
    return {
      work: result.work,
      bookData: result.matchingBooks[0],
    };
  };
  