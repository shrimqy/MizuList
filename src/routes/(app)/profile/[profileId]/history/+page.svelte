<script>
  /** @type {import('./$types').PageData} */
  import { page } from "$app/stores";
  import { formatDate, filterTags } from "$lib/utils";
  import { fade } from "svelte/transition";
  $: lastActivity = $page.data.lastActivity;
  $: userData = $page.data.userData;
</script>

<div class="container" in:fade={{ duration: 300 }}>
  <div class="activity">
    <h1>Activity</h1>
    <div class="aContainer">
      {#each lastActivity.slice(0, 20) as book}
        <div class="bookCard">
          <div class="titleCover">
            <div class="imageContainer">
              <img src={book.book.coverUrl} alt={book.title} />
              <a data-sveltekit-preload-data href="/books/{book.bookId}">
                <!-- <button class="material-symbols-rounded">open_in_new</button> -->
              </a>
            </div>

            <div class="titleProgress">
              <a href="/books/{book.bookId}">
                <div class="title">{book.title}</div>
              </a>
              <div class="progress">
                <div>{book.category.name}</div>
                <div>
                  {book.pages ? book.pages : "-"}/{book.tPages
                    ? book.tPages
                    : "?"}
                </div>
                <div>
                  Scored
                  <span
                    >{book.rating !== null && book.rating !== "0"
                      ? book.rating
                      : "-"}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="dateSpan">
            {formatDate(book.timestamp)}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  * {
    font-family: "Overpass", sans-serif;
    outline: none;
    text-decoration: none;
  }

  :root {
    background-color: #edf1f5;
    color: #5c728a;
    overflow-y: scroll; /* Always show the vertical scroll bar */
  }

  /* Media queries */
  @media (max-width: 1024px) {
    .container {
      margin: 0 10rem;
    }
  }

  @media (max-width: 768px) {
    .container {
      margin: 0 5rem;
    }
  }

  @media (max-width: 480px) {
    .container {
      margin: 0 2rem;
    }
  }

  /* .material-icons {
		font-family: 'Material Icons';
	} */

  /* Hide the vertical scroll bar */
  ::-webkit-scrollbar {
    width: 0.5em;
    background-color: #edf1f5;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #5c728a;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #1faafa;
  }

  .container {
    margin: 0 18%;
  }

  .activity {
    margin: 1rem 0;
    width: 100%;
  }

  .bookCard {
    will-change: transform; /* Hint to the browser about upcoming change */
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
    border-radius: 7px;
    background-color: #fafafa;
    padding-right: 1rem;
    flex-wrap: wrap;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .bookCard:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .titleCover {
    display: flex;
    align-items: center;
  }

  .imageContainer {
    position: relative;
    padding: 0;
    display: flex;
  }

  .imageContainer img {
    will-change: transform; /* Hint to the browser about upcoming change */
    width: 67px;
    height: 90px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
  }

  .titleProgress {
    display: flex;
    width: 70%;
    flex-direction: column;
    justify-content: space-between;
    float: left;
    padding-left: 1rem;
    flex-wrap: wrap;
  }

  .title {
    color: #35539e;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease-in-out;
  }

  .title:hover {
    color: #1faafa;
  }

  .progress {
    display: flex;
    color: #858585;
    font-size: 12px;
    font-weight: 600;
    /* justify-content: space-between; */
  }

  .progress div {
    margin-right: 0.3rem;
    padding-right: 0.3rem;
  }

  .dateSpan {
    display: flex;
    color: #858585;
    font-size: 12px;
    font-weight: 700;
    align-items: center;
  }
</style>
