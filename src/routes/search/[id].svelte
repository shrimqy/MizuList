<script>
  export async function load({ fetch, params }) {
    const searchValue = params.id;
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}&key=AIzaSyCkrEybLxKZeRCAi3tB51zcTLnY9LKgIj0`);
    const data = await res.json();
    if (res.ok) {
      return {
        props: {
          searchResult: data.items
        }
      };
    }
  }
</script>
