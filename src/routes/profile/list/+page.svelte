<script>
	export let data;
	let { existingBook, fav } = data;
	// console.log(existingBook);
	const filteredItems = existingBook.filter((item) => item.bookCategory.includes(2));
	console.log(filteredItems);
	let progress = '?';
</script>

<div class="container">
	<div class="listContainer">
		<div class="listBookData">
			{#each filteredItems as book}
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
									<button class="material-icons">more_horiz</button>
								</div>
							{:else}
								<span>No cover available</span>
								<!-- Show this if no cover was found from the API -->
							{/if}
							<a data-sveltekit-preload-data="hover" href="/books/{book.bookId}">
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
									<div>{book.pages ? book.pages : '-'}</div>
									<div>{book.chapters ? book.chapters : '-'}</div>
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

	.material-icons {
		font-family: 'Material Icons';
	}

	:root {
		background-color: #edf1f5;
		color: #5c728a;
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
		transform: scaleY(1);
	}

	.bookHoverCover img {
		position: absolute;
		left: -9rem;
		bottom: -4rem;
		border-radius: 6px;
		width: 7rem;
		height: 10rem;
		object-fit: cover;
		transform: scaleY(0);
		/* display: none; */
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
		position: relative; /* Added position relative */
	}

	.material-icons {
		position: absolute;
		top: 0;
		left: 0;
		border: none;
		font-size: 56px;
		color: white;
		background-color: rgba(0, 0, 0, 0.5); /* Set the background color of the icon */
		border-radius: 50%; /* Rounded border for the icon */
		padding: 4px; /* Add some padding to the icon */
		display: none; /* Hide the icon by default */
	}

	.imageContainer:hover .material-icons {
		display: block; /* Show the icon when hovering over the image container */
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
		/* margin-left: 1rem; */
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
