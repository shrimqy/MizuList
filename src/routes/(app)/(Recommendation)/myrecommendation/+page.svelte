<script>
	/** @type {import('./$types').PageData} */
	import { fade, fly, scale } from 'svelte/transition'; //for transitions
	export let data;
	let { existingBook } = data;

	const filteredItems = existingBook.filter((item) => item.bookCategory.includes(1));
	filteredItems.sort((a, b) => {
		// Assuming 'a' and 'b' are objects with a 'title' property
		const titleA = a.book.englishTitle.toLowerCase();
		const titleB = b.book.englishTitle.toLowerCase();

		if (titleA < titleB) {
			return -1;
		}
		if (titleA > titleB) {
			return 1;
		}
		return 0;
	});

	let selectedBooks = [];
</script>

<div class="container">
	<h1>Recommendations</h1>
	<h3>Choose two similar books</h3>
	<form method="POST" action="?/recommendation" class="content">
		<div class="listContainer">
			<div class="listBookData">
				{#each filteredItems as item, index}
					<div class="bookCard">
						<input
							type="checkbox"
							bind:group={selectedBooks}
							class="checkboxInput"
							name="selections"
							value={item.bookID}
							id="book{index}"
							disabled={selectedBooks.length === 2 && !selectedBooks.includes(item.bookID)}
						/>
						<div class="titleCover">
							<a
								data-sveltekit-preload-data
								href="/books/{item.bookID}"
							>
								<div class="bookCard">
									<div class="imageContainer">
										{#if item.book.coverUrl}
											<img
												src={item.book?.coverUrl}
												alt={item.book?.englishTitle}
											/>
										{:else}
											<span>No cover available</span>
										{/if}
									</div>
									<div class="title">{item.book.englishTitle}</div>
								</div>
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="sbutton">
			<button formaction="?/recommendation" type="submit">Submit</button>
		</div>
	</form>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Caveat&family=Istok+Web&family=Poppins:wght@300&display=swap%27');
	* {
		font-family: 'Overpass', sans-serif;
		text-decoration: none;
		outline: none;
	}

	/* .material-icons {
		font-family: 'Material Icons';
	}

	.material-symbols-rounded {
		font-family: 'Material Symbols Rounded';
	} */

	:root {
		background-color: #edf1f5;
		color: #5c728a;
		overflow-y: scroll; /* Always show the vertical scroll bar */
	}

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
		margin: 2% 23%;
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.listContainer {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.bookCard {
		display: flex;
		justify-content: space-between;
		margin: 0.3rem 0;
		border-radius: 3px;
		background-color: #fafafa;
		align-items: center;
		padding: 0.4rem 0.5rem;
	}

	.titleCover {
		display: flex;
		align-items: center;
		position: relative;
	}

	.titleCover {
		width: 95%;
	}

	.imageContainer {
		position: relative;
		padding: 0;
		display: flex;
	}

	.imageContainer img {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		object-fit: cover;
	}

	.title {
		color: #5c728a;
		padding-left: 16px;
		font-weight: 700;
		font-size: 14px;
		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.sbutton {
		border-bottom: 1px solid rgb(250, 244, 244);
	}

	.sbutton button {
		margin: 2rem 1rem;
		float: right;
		padding: 0.5rem 1.4rem;
		background-color: #3577ff;
		display: flex;
		font-size: 12px;
		align-items: center;
		color: #fafafa;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
</style>
