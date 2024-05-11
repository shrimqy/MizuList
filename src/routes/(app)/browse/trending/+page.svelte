<script>
  import { goto } from "$app/navigation";
  import { fade, fly, scale } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  let form;
  export let data;
  $: book = null;
  $: inputValue = "";
  const search = () => {
    return async ({ result, update }) => {
      book = result.data.search;
      console.log(book);
      await invalidateAll();
    };
  };
</script>

<title>Home</title>
<div class="container">
  <h3>Search</h3>
  <form
    bind:this={form}
    method="post"
    action="?/search"
    class="search-container"
    use:enhance={search}
  >
    <input
      on:input={() => form.requestSubmit()}
      bind:value={inputValue}
      type="search"
      class="search-box"
      name="search"
    />
    <span class="material-icons">search</span>
  </form>

  {#if inputValue == "" || inputValue == null}
    <div class="listContainer">
      <div class="list">
        <div class="header">
          <h1>TRENDING WEEKLY NOW</h1>
        </div>

        <div class="book-container">
          {#each data.weeklyPopularBooks as book}
            <a data-sveltekit-preload-data href="/books/{book.id}">
              <div class="bookCard">
                <div class="bookCover" in:fade={{ duration: 500 }}>
                  {#if book.coverUrl}
                    <img src={book?.coverUrl} alt={book?.englishTitle} />
                  {:else}
                    <span>No cover available</span>
                  {/if}
                </div>
                <div class="title">{book.englishTitle}</div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>
  {:else if book && book.length > 0}
    <div class="book-container">
      {#each book as book}
        <a data-sveltekit-preload-data href="/books/{book.id}">
          <div class="bookCard">
            <div class="bookCover" in:scale={{ duration: 500 }}>
              {#if book.coverUrl}
                <img src={book?.coverUrl} alt={book?.englishTitle} />
              {:else}
                <span>No cover available</span>
              {/if}
            </div>
            <div class="title">{book.englishTitle}</div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <span class="result"
      >No Results Found, <a href="edit/new">Click here to Add Book Data</a
      ></span
    >
  {/if}
</div>

<style>
  * {
    margin: 0px;
    padding: 0px;
    font-family: "Overpass", sans-serif;
  }

  :root {
    background-color: #edf1f5;
  }

  a {
    text-decoration: none;
  }

  .result a {
    color: #1faafa;
  }

  .container {
    padding: 2rem;
    max-width: 65%;
    margin: 0 auto;
  }

  h1 {
    font-size: 16px;
    color: #647380;
    font-weight: 700;
  }

  h3 {
    font-size: 1px;
    font-weight: 600;
    color: #5e5e5e;
    padding-bottom: 1rem;
  }

  .listContainer {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .book-container {
    width: 100%;
    padding: 1rem 0rem;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 2rem;
  }

  .bookCard {
    will-change: transform;
    font-size: 15px;
    color: #647380;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.3s ease-in-out;
  }

  .bookCover {
    width: 100%;
    height: 265px;
    background-color: rgb(202, 202, 202);
    border-radius: 6px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
  }

  .viewAllLink {
    color: #909eac;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
  }

  .viewAllLink:hover {
    color: #5a6772;
  }

  img {
    width: 100%;
    height: 265px;
    border-style: none;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .title {
    padding: 10px 0;
    overflow-wrap: break-word;
  }

  .bookCard:hover {
    color: #1faafa;
  }

  .bookCard img:hover {
    transform: scale(1.01);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  }

  /* Style the search box */
  .search-container {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 1rem;
  }

  .search-box {
    padding: 10px 15px 10px 40px;
    border: none;
    border-radius: 7px;
    background-color: #fff;
    font-size: 15px;
    font-weight: 600;
    width: 100%;
    max-width: 300px;
    color: #5e5e5e;
    height: 40px;
    box-shadow: 0px 2px 7px rgba(37, 34, 63, 0.1);
  }
  .search-box:focus {
    outline: none;
  }

  .material-icons {
    font-family: "Material Icons";
    font-weight: 600;
    font-size: 17px; /* Preferred icon size */
    color: #9e9e9e;
    padding: 0px 10px;
    position: absolute;
  }

  /* Responsive Styles */
  @media screen and (max-width: 900px) {
    .container {
      max-width: 80%;
      padding: 1rem; /* Adjusted padding */
    }

    .bookCover {
      width: 100%;
      height: 215px;
    }

    img {
      width: 100%;
      height: 215px;
    }
  }
  @media screen and (max-width: 1440px) {
    .container {
      padding: 1rem; /* Adjusted padding */
      max-width: 65%;
    }

    .bookCover {
      width: 100%;
      height: 215px;
    }

    img {
      width: 100%;
      height: 215px;
    }
  }
</style>
