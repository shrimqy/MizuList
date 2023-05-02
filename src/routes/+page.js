export async function load({ fetch }) {
    const res = await fetch('https://openlibrary.org/trending/weekly.json?limit=18');
    const bookTitle = await res.json();
    if (res.ok) {
        return {
            props: {
                bookTitle: bookTitle.works
            }
        }
    }
    return {
        status: res.status,
        error: new Error("Error loading")
    }
}

