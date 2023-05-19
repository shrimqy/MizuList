<script>
	import { goto } from '$app/navigation'; //for navigation to the search page
	import { fade } from 'svelte/transition'; //for transitions
	export let data; //data fetch from the API
	let book = data.book.works; //assigning the data to book
	let inputValue = '';

	function submitSearch() {
		goto('search/' + inputValue); //search page url
	}
</script>

<div class="container">
	<h3>Search</h3>
	<form on:submit|preventDefault={submitSearch} class="search-container">
		<input bind:value={inputValue} type="search" class="search-box" name="search-box" />
		<span class="material-icons">search</span>
	</form>
	<h1>Trending Weekly Now</h1>
	<div transition:fade class="book-container" data-sveltekit-preload-data>
		{#each book as book}
			<!-- since the data fetched is an array  -->
			<a
				data-sveltekit-preload-data="hover"
				href="/books/{book.key.split('/')[2]}"
				onerror="this.href='/books/{book.cover_edition_key}"
			>
				<!-- Link to the book page -->
				<div class="bookCard">
					<div class="bookCover">
						{#if book.cover_edition_key}
							<!-- Book cover source -->
							<img
								src={'http://covers.openlibrary.org/b/olid/' +
									book.cover_edition_key +
									'-M.jpg?default=false'}
								alt={book.title}
							/>
						{:else}
							<span>No cover available</span> <!-- Show this if no cover was found from the API -->
						{/if}
					</div>
					<div class="title">{book.title}</div>
				</div></a
			>
		{/each}
	</div>
</div>

<style>
	* {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
	}

	:root {
		background-color: #edf1f5;
	}

	a {
		text-decoration: none;
	}

	.container {
		padding: 7rem 18rem;
	}

	h1 {
		padding-top: 40px;
		font-size: 22px;
		color: #5e5e5e;
		font-weight: 600;
	}

	h3 {
		font-size: 16px;
		font-weight: 600;
		color: #5e5e5e;
		padding-bottom: 10px;
	}

	.book-container {
		padding: 1rem 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		color: #647380;
	}

	.bookCard {
		width: 21vb;
		font-size: 15px;
		color: #647380;
		font-weight: 600;
		display: flex;
		flex-direction: column;
	}

	.bookCover {
		background-color: rgb(202, 202, 202);
		height: 30vh;
		width: 19.5vh;
		border-radius: 6px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #fff;
	}

	img {
		height: 30vh;
		width: 19.5vh;
		border-style: none;
		object-fit: cover;
		border-radius: 6px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
	}

	.title {
		padding: 10px 0;
		overflow-wrap: break-word;
	}

	/* Style the search box */
	.search-container {
		display: flex;
		align-items: center;
		position: relative;
	}

	.search-box {
		padding: 10px 15px 10px 40px;
		border: none;
		border-radius: 7px;
		background-color: #fff;
		font-size: 15px;
		font-weight: 600;
		width: 250px;
		color: #5e5e5e;
		height: 40px;
		box-shadow: 0px 2px 10px rgba(37, 34, 63, 0.1);
	}
	.search-box:focus {
		outline: none;
	}

	.material-icons {
		font-family: 'Material Icons';
		font-weight: 600;
		font-size: 17px; /* Preferred icon size */
		color: #9e9e9e;
		padding: 0px 10px;
		position: absolute;
	}
</style>
