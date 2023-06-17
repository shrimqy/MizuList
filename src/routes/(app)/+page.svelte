<script>
	/** @type {import('./$types').PageData} */
	import { formatDate, filterDataLastDay } from '$lib/utils';
	export let data;
	let { lastActivity } = data;
</script>

<div class="page-content">
	<div class="container">
		<div class="activity" style="width: 60%;">
			<h1>Activity</h1>
			<div class="aContainer">
				{#each filterDataLastDay(lastActivity.slice(0, 15)) as book}
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
						<div class="timeStamp">
							{formatDate(book.timestamp)}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="list-preview">
			<h1>Book in Progress</h1>
		</div>
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

	.page-content {
		margin: 0 18%;
	}

	.container {
		display: flex;
		justify-content: space-between;
		padding: 2rem 0;
		gap: 2rem;
	}

	h1 {
		font-size: 20px;
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
		min-height: 6.5rem;
		border-radius: 5px;
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
		width: 77px;
		align-items: center;
	}

	.imageContainer img {
		width: 77px;
		height: 100%;
		object-fit: cover;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.details {
		display: flex;
		padding-left: 1rem;
		margin: 0.5rem 0;
		gap: 10px;
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
		font-size: 16px;
		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.timeStamp {
		color: #9299a1;
		font-size: 11px;
		margin: 0.5rem 0.5rem;
		width: 6rem;
		font-weight: 600;
		text-align: right;
	}
</style>
