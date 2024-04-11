<script>
	import { goto } from '$app/navigation'; //for navigation to the search page
	import { fade, fly, scale } from 'svelte/transition'; //for transitions

	export let data; //data fetch from the API
	let inputValue = '';
	function submitSearch() {
		goto('browse/' + inputValue); //search page url
	}
</script>

<title>Home</title>
<div class="container">
	<h3>Search</h3>
	<form on:submit|preventDefault={submitSearch} class="search-container">
		<input bind:value={inputValue} type="search" class="search-box" name="search-box" />
		<span class="material-icons">search</span>
	</form>
	<h1>Trending Weekly Now</h1>
	<div class="book-container">
		{#each data.weeklyPopularBooks as book}
			<!-- since the data fetched is an array  -->
			<a
				data-sveltekit-preload-data
				href="/books/{book.id}"
			>
				<!-- Link to the book page -->
				<div class="bookCard">
					<div class="bookCover" in:scale={{ duration: 300 }}>
						{#if book.coverUrl}
							<!-- Book cover source -->
							<img
								src={book?.coverUrl}
								alt={book?.englishTitle}
							/>
						{:else}
							<span>No cover available</span> <!-- Show this if no cover was found from the API -->
						{/if}
					</div>
					<div class="title">{book.englishTitle}</div>
				</div>
			</a>
		{/each}
	</div>
	<h1>Top Rated</h1>
	<div class="book-container">
		{#each data.topRatedBooks as book}
			<!-- since the data fetched is an array  -->
			<a
				data-sveltekit-preload-data
				href="/books/{book.id}"
			>
				<!-- Link to the book page -->
				<div class="bookCard">
					<div class="bookCover" in:scale={{ duration: 300 }}>
						{#if book.coverUrl}
							<!-- Book cover source -->
							<img
								src={book?.coverUrl}
								alt={book?.englishTitle}
							/>
						{:else}
							<span>No cover available</span> <!-- Show this if no cover was found from the API -->
						{/if}
					</div>
					<div class="title">{book.englishTitle}</div>
				</div>
			</a>
		{/each}
	</div>
	<h1>All Time Popular</h1>
	<div class="book-container">
		{#each data.allTimePopularBooks as book}
			<!-- since the data fetched is an array  -->
			<a
				data-sveltekit-preload-data
				href="/books/{book.id}"
			>
				<!-- Link to the book page -->
				<div class="bookCard">
					<div class="bookCover" in:scale={{ duration: 300 }}>
						{#if book.coverUrl}
							<!-- Book cover source -->
							<img
								src={book?.coverUrl}
								alt={book?.englishTitle}
							/>
						{:else}
							<span>No cover available</span> <!-- Show this if no cover was found from the API -->
						{/if}
					</div>
					<div class="title">{book.englishTitle}</div>
				</div>
			</a>
		{/each}
	</div>
	<h1>New Entries</h1>
	<div class="book-container">
		{#each data.allTimePopularBooks as book}
			<!-- since the data fetched is an array  -->
			<a
				data-sveltekit-preload-data
				href="/books/{book.id}"
			>
				<!-- Link to the book page -->
				<div class="bookCard">
					<div class="bookCover" in:scale={{ duration: 300 }}>
						{#if book.coverUrl}
							<!-- Book cover source -->
							<img
								src={book?.coverUrl}
								alt={book?.englishTitle}
							/>
						{:else}
							<span>No cover available</span> <!-- Show this if no cover was found from the API -->
						{/if}
					</div>
					<div class="title">{book.englishTitle}</div>
				</div>
			</a>
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
		padding: 2rem; /* Adjusted padding */
		max-width: 65%; /* Added max-width */
		margin: 0 auto; /* Centered horizontally */
	}

	h1 {
		padding-top: 2rem; /* Adjusted padding */
		font-size: 22px;
		color: #5e5e5e;
		font-weight: 600;
	}

	h3 {
		font-size: 16px;
		font-weight: 600;
		color: #5e5e5e;
		padding-bottom: 1rem; /* Adjusted padding */
	}

	.book-container {
		padding: 1rem 0rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		color: #647380;
	}

	.bookCard {
		will-change: transform; /* Hint to the browser about upcoming change */
		font-size: 15px;
		color: #647380;
		padding-right: 0.7rem;
		font-weight: 600;
		display: flex;
		flex-direction: column;
		height: 100%; /* Added height */
		transition: all 0.3s ease-in-out;
	}

	.bookCover {
		width: 150px;
		height: 220px;
		background-color: rgb(202, 202, 202);
		border-radius: 6px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #fff;
	}

	img {
		width: 100%;
		height: 100%;
		border-style: none;
		object-fit: cover;
		border-radius: 6px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.title {
		padding: 10px 0;
		overflow-wrap: break-word;
	}

	.bookCard:hover {
		color: #1faafa;
	}

	.bookCard img:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
	}

	/* Style the search box */
	.search-container {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 1rem; /* Added margin */
	}

	.search-box {
		padding: 10px 15px 10px 40px;
		border: none;
		border-radius: 7px;
		background-color: #fff;
		font-size: 15px;
		font-weight: 600;
		width: 100%; /* Adjusted width */
		max-width: 300px; /* Added max-width */
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

	/* Responsive Styles */
	@media screen and (max-width: 600px) {
		.container {
			padding: 1rem; /* Adjusted padding */
		}

		.search-box {
			max-width: none; /* Reset max-width */
		}
	}
</style>
