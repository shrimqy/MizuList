<script>
  export let onSubmit;

  let searchTerm = '';
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=AIzaSyCkrEybLxKZeRCAi3tB51zcTLnY9LKgIj0`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    onSubmit(data.items);
  }
</script>

<form on:submit={handleSubmit}>
  <input type="text" bind:value={searchTerm} />
  <button type="submit">Search</button>
</form>

  