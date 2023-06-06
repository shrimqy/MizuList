<script>
	export let data;
	let { existingBook, fav } = data;
	const filteredItems = existingBook.filter((item) => item.bookCategory.includes(3));
	console.log(filteredItems);
	let progress = '?';
</script>

<div class="container">
	<div class="listContainer">
		<div class="listBookData">
			{#each existingBook as book}
				<!-- since the data fetched is an array  -->

				<!-- Link to the book page -->
				<form method="POST" action="?/userStatus">
					<div class="bookCard">
						<div class="titleCover">
							{#if book.bookId}
								<!-- Book cover source -->
								<div class="bookHoverCover">
									<img
										src={'http://covers.openlibrary.org/b/id/' +
											book.covers +
											'-M.jpg?default=false'}
										alt={book.title}
									/>
								</div>

								<div class="imageContainer">
									<img
										src={'http://covers.openlibrary.org/b/id/' +
											book.covers +
											'-M.jpg?default=false'}
										alt={book.title}
									/>
									<a data-sveltekit-preload-data="hover" href="/books/{book.bookId}"
										><button class="material-symbols-rounded">open_in_new</button>
									</a>
								</div>
							{:else}
								<span>No cover available</span>
								<!-- Show this if no cover was found from the API -->
							{/if}
							<a href="/books/{book.bookId}">
								<div class="title">{book.title}</div>
							</a>
						</div>

						<!-- <button class="fbutton" id="addToListButton" on:click|preventDefault={setDefaultStatus}
							><span class="material-icons"> remove </span></button
						> -->

						<div class="contentWrapper">
							<div class="progress">
								<div class="progressHeader">
									<span>Chapters</span>
									<span>Pages</span>
								</div>
								<div class="progressData">
									<div>{book.chapters ? book.chapters : '-'}</div>
									<div>{book.pages ? book.pages : '-'}</div>
								</div>
							</div>

							<div class="dateSpan">
								<div class="dateStart">
									<span>Start</span>
									<span>End</span>
									<span>Days</span>
								</div>
								<div class="dateEnd">
									<div>{book.createdAt ? book.createdAt.toISOString().split('T')[0] : '-'}</div>
									<div>
										{book.completedAt ? book.completedAt.toISOString().split('T')[0] : '-'}
									</div>
									<div>
										{book.completedAt && book.createdAt
											? Math.floor(
													(new Date(book.completedAt) - new Date(book.createdAt)) /
														(1000 * 60 * 60 * 24)
											  )
											: '-'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			{/each}
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
		text-decoration: none;
		outline: none;
	}

	.material-symbols-rounded {
		font-family: 'Material Symbols Rounded';
	}

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
		margin: 0 20rem;
	}

	.listContainer {
		display: flex;
		flex-direction: column;
		padding: 3rem 0rem;
	}

	.bookCard:hover .bookHoverCover img {
		opacity: 1;
		visibility: visible;
	}

	.bookHoverCover img {
		position: absolute;
		left: -9rem;
		bottom: -4rem;
		border-radius: 6px;
		width: 7rem;
		height: 10rem;
		object-fit: cover;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
	}

	.listBookData {
		display: flex;
		flex-direction: column;
	}

	.bookCard {
		display: flex;
		justify-content: space-between;
		margin: 0.3rem 0;
		border-radius: 1px;
		background-color: #fafafa;
		align-items: center;
		padding: 0.4rem 0.5rem;
	}

	.titleCover {
		display: flex;
		align-items: center;
		position: relative;
	}

	.imageContainer {
		position: relative;
		padding: 0;
		display: flex;
	}

	.material-symbols-rounded {
		position: absolute;
		top: 0;
		left: 0;
		border: none;
		height: 64px;
		width: 100%;
		font-size: 23px;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.5); /* Set the background color of the icon */
		border-radius: 50%; /* Rounded border for the icon */
		opacity: 0;
		visibility: hidden; /*element is not rendered*/
		transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
	}

	.imageContainer:hover .material-symbols-rounded {
		opacity: 1;
		visibility: visible;
	}

	.imageContainer img {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		object-fit: cover;
	}

	.title {
		color: #5c728a;
		padding-left: 1rem;
		font-weight: 700;
		font-size: 14px;
		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.contentWrapper {
		display: flex;
		width: 37%;
		justify-content: space-between;
	}

	.progress {
		display: flex;
		font-size: 12px;
		justify-content: space-between;
		align-items: center;
	}

	.dateSpan {
		display: flex;
		font-size: 12px;
		align-items: center;
	}

	.dateStart,
	.dateEnd {
		display: flex;
		font-size: 10px;
		flex-direction: column;
		justify-content: space-between;
	}

	.dateSpan span {
		padding-right: 0.5rem;
		margin: 0.2rem 0rem;
		border-right: 1px solid rgb(229, 231, 235);
	}

	.dateSpan div {
		padding: 0rem 0.4rem;
		margin: 0.2rem 0;
	}

	.progressHeader,
	.progressData {
		padding: 0 0.5rem;
		display: flex;
		font-size: 12px;
		flex-direction: column;
		justify-content: space-between;
	}

	.progress span {
		padding-right: 0.5rem;
		margin: 0.3rem 0rem;
		border-right: 1px solid rgb(229, 231, 235);
	}

	.progress div {
		padding: 0rem 0.4rem;
		margin: 0.3rem 0;
	}
</style>
