<script>
	/** @type {import('./$types').PageData} */
	import { formatDate, filterDataLastDay } from '$lib/utils';
	export let data;

	let { lastActivity, existingBook, user } = data;
	const filteredItems = existingBook?.filter((item) => item.bookCategory.includes(2));
</script>

<div class="page-content">
	<div class="container">
		<div class="activity" style="width: 67%;">
			<h1>Global Activity</h1>
			<div class="aContainer">
				{#each filterDataLastDay(lastActivity.slice(0, 20)) as book}
					<div class="bookCard">
						<div class="titleCover">
							<div class="imageContainer">
								{#if book.bookId}
									<!-- Book cover source -->

									<img
										src={'http://covers.openlibrary.org/b/id/' +
											book.covers +
											'-M.jpg?default=false'}
										alt={book.title}
									/>
									<a data-sveltekit-preload-data href="/books/{book.bookId}">
										<!-- <button class="material-symbols-rounded">open_in_new</button> -->
									</a>
								{:else}
									<span>No cover</span>
									<!-- Show this if no cover was found from the API -->
								{/if}
							</div>
							<div class="details">
								<a data-sveltekit-preload-code href="/profile/{book.user.username}/">
									<div class="title">{book.user.username}</div>
								</a>

								<div class="status">
									{book.category.name}
									<div class="bookTitle">{book.title}</div>
									<div>{book.pages ? book.pages : '-'}/{book.tPages ? book.tPages : '?'}</div>
									<div>
										Scored
										<span>{book.rating !== null && book.rating !== '0' ? book.rating : '-'}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="A-Right">
							<div class="timeStamp">
								{formatDate(book.timestamp)}
							</div>
							<div class="likes">
								<span class="material-icons-round" style="font-size: 13px;"> favorite </span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		{#if user?.name}
			<div class="list-preview">
				<h1>Books in Progress</h1>
				<div class="list-container">
					{#each filteredItems as book}
						<div class="listCard">
							<a data-sveltekit-preload-data href="/books/{book.bookId}">
								{#if book.bookId}
									<img
										src={'http://covers.openlibrary.org/b/id/' +
											book.covers +
											'-M.jpg?default=false'}
										alt={book.title}
									/>
								{:else}
									<span>{book.title}</span>
									<!-- Show this if no cover was found from the API -->
								{/if}
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
	}

	:root {
		background-color: #edf1f5;
		color: #5c728a;
		overflow-y: scroll; /* Always show the vertical scroll bar */
	}

	.material-icons-round {
		font-family: 'Material Symbols Rounded';
	}

	.page-content {
		margin: 0 18%;
	}

	.container {
		display: flex;
		justify-content: space-between;
		padding: 3rem 0;
		gap: 2rem;
	}

	h1 {
		font-size: 18px;
	}

	.aContainer {
		margin: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.bookCard {
		width: 100%;
		display: flex;
		height: 6.5rem;
		border-radius: 4px;
		background-color: #fafafa;
		transition: transform 0.3s, box-shadow 0.3s ease-in-out;
	}

	.bookCard:hover {
		transform: scale(1.002);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.titleCover {
		width: 100%;
		display: flex;
	}

	.imageContainer {
		position: relative;
		padding: 0;
		display: flex;
		width: auto;
		align-items: center;
	}

	.imageContainer img {
		width: 70px;
		height: 100%;

		border-top-left-radius: 4px;
		border-bottom-left-radius: 4x;
	}

	.details {
		display: flex;
		padding-left: 1rem;
		margin: 0.5rem 0;
		font-size: 14px;
		gap: 25%;
		flex-direction: column;
	}

	.status {
		display: flex;
		gap: 5px;
	}

	.title,
	.bookTitle {
		color: #3db4f2;
		font-weight: 500;

		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.A-Right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: #9299a1;
		font-size: 11px;
		margin: 0.5rem 0.5rem;
		width: 6rem;
		font-weight: 600;
		text-align: right;
	}

	.list-preview {
		width: 45%;
	}

	.list-container {
		margin-top: 1rem;
		display: grid;
		background-color: #fafafa;
		grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
		grid-template-rows: repeat(auto-fit, minmax(115px, 1fr));
		box-sizing: border-box;
		border-radius: 4px;
		padding: 1rem;
		grid-gap: 20px;
		min-width: 0;
	}

	.listCard {
		max-width: 5.5rem;
		max-height: 8rem;
		border-radius: 4px;
		transition: transform 0.3s, box-shadow 0.3s;
		background-color: #9299a146;
	}
	.listCard img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
		background-color: rgb(202, 202, 202);
		border-radius: 4px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #fff;
	}

	.listCard:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
	}
</style>
