<script>
	import { fade, slide } from 'svelte/transition';

	export let data;
	let { existingBook, fav } = data;

	const filteredItems = existingBook?.filter((item) => item.bookCategory.includes(3));
	//sort by title
	filteredItems?.sort((a, b) => {
		const titleA = a.englishTitle?.toLowerCase();
		const titleB = b.englishTitle?.toLowerCase();

		if (titleA < titleB) {
			return -1;
		}
		if (titleA > titleB) {
			return 1;
		}
		return 0;
	});
	let progress = '?';
	let showForm = [];
	const convertedItems = filteredItems.map((item) => {
		const convertedCreatedAt = item.startedDate ? new Date(item?.startedDate)?.toISOString().split('T')[0] : null;
		const convertedUpdatedAt = item.lastUpdated ? new Date(item?.lastUpdated)?.toISOString().split('T')[0] : null;
		const convertedcompletedAt = item.completedAt
			? new Date(item?.completedAt)?.toISOString().split('T')[0]
			: null;
		return {
			...item,
			createdAt: convertedCreatedAt,
			updatedAt: convertedUpdatedAt,
			completedAt: convertedcompletedAt
		};
	});

	function toggleForm(index) {
		showForm[index] = !showForm[index];
	}
</script>

<div class="container">
	<div class="listContainer">
		<div class="list-head">
			<div class="titleCover">
				<div class="list-cover" />
				<div class="list-title">Title</div>
			</div>

			<div class="contentWrapperHead">
				<div class="list-score">Score</div>
				<div class="list-progress">Progress</div>
				<div class="list-date">Dates</div>
			</div>
		</div>
		<div class="listBookData">
			{#each convertedItems as listItem, index}
				<form>
					<div class="bookCard" in:slide={{ x: 0, y: 100, duration: 500 }}>
						<div class="titleCover">
							{#if listItem.book.coverUrl}

								<div class="bookHoverCover">
									<img
										src={listItem.book.coverUrl}
										alt={listItem.book.englishTitle}
									/>
									<a data-sveltekit-preload-data href="/books/{listItem.bookId}">
										<!-- <button class="material-symbols-rounded">open_in_new</button> -->
									</a>
								</div>
								<div class="imageContainer">
									<img
										src={listItem.book.coverUrl}
										alt={listItem.book.englishTitle}
									/>
									<button
										class="material-symbols-rounded"
										on:click|preventDefault={() => toggleForm(index)}>open_in_new</button
									>
								</div>
								<a href="/books/{listItem.id}">
									<div class="title">{listItem.book.englishTitle}</div>
								</a>
							{:else}
								<div class="imageContainer">
									<img
										src={listItem.book.coverUrl}
										alt={listItem.book.englishTitle}
									/>
									<button
										class="material-symbols-rounded"
										on:click|preventDefault={() => toggleForm(index)}>open_in_new</button
									>
								</div>
								<!-- Show this if no cover was found from the API -->
								<div class="title">{listItem.book.englishTitle}</div>
							{/if}
						</div>

						<!-- <button class="fbutton" id="addToListButton" on:click|preventDefault={setDefaultStatus}
							><span class="material-icons"> remove </span></button
						> -->

						<div class="contentWrapper">
							<div class="score">{listItem.rating !== '0' && null ? listItem.rating : '-'}</div>
							<div class="progress">
								<div class="progressHeader">
									<span>Chapters</span>
									<span>Pages</span>
								</div>
								<div class="progressData">
									<div>{listItem.chapters ? listItem.chapters : '-'}</div>
									<div>{listItem.pages ? listItem.pages : '-'}</div>
								</div>
							</div>

							<div class="dateSpan">
								<div class="dateStart">
									<span>Start</span>
									<span>End</span>
									<span>Days</span>
								</div>
								<div class="dateEnd">
									<div>{listItem.createdAt ? listItem.createdAt : '-'}</div>
									<div>
										{listItem.completedAt ? listItem.completedAt : '-'}
									</div>
									<div>
										{listItem.completedAt && listItem.createdAt
											? Math.floor(
													(new Date(listItem.completedAt) - new Date(listItem.createdAt)) /
														(1000 * 60 * 60 * 24)
											  )
											: '-'}
									</div>
								</div>
							</div>
						</div>
					</div>
					{#if showForm[index]}
						<div class="editor-popout" in:fade={{ duration: 300 }}>
							<form method="POST" action="?/userStatus">
								<div class="editor">
									<div class="editor-banner">
										<button type="button" class="cancelButton" on:click={() => toggleForm(index)}>
											<span class="material-icons">close</span></button
										>

										<div class="editor-header">
											<div class="bookdd">
												<div class="editor-cover">
													{#if listItem.book.covers}
														<img
														src={listItem.coverUrl}
														alt={listItem.title}
													/>
										
													{:else}
														<span>No cover available</span>
													{/if}
												</div>
												<div class="editor-title">{listItem.title}</div>
											</div>

											<div class="ebutton">
												<button class="esave" formaction="?/userStatus" type="submit">Save</button>
												<button class="edelete" formaction="?/delete" type="submit">Delete</button>
											</div>
										</div>
									</div>
									<div class="editor-container">
										<div class="e-userStatus">
											<div class="e-1">
												<select id="status" name="status" bind:value={listItem.bookCategory[1]}>
													<option value={2}>Reading</option>
													<option value={3} id="defaultOption">Plan to Read</option>
													<option value={4}>Paused</option>
													<option value={5}>Dropped</option>
													<option value={6}>Completed</option>
												</select>
												<input
													type="date"
													bind:value={listItem.createdAt}
													name="startDate"
													placeholder="Start Date"
												/>
												<input
													type="date"
													bind:value={listItem.completedAt}
													name="finishDate"
													placeholder="Finish Date"
												/>
											</div>

											<div class="e-2">
												<select class="e-rating" name="rating" id="rating" bind:value={listItem.rating}>
													<option value="0">Select</option>
													<option value="1">(1) Appalling</option>
													<option value="2">(2) Horrible</option>
													<option value="3">(3) Very Bad</option>
													<option value="4">(4) Bad</option>
													<option value="5">(5) Average</option>
													<option value="6">(6) Fine</option>
													<option value="7">(7) Good</option>
													<option value="8">(8) Good</option>
													<option value="9">(9) Great</option>
													<option value="10">(10) Masterpiece</option>
												</select>
												<input
													type="number"
													id="rereads"
													bind:value={listItem.rereads}
													min="0"
													name="rereads"
													placeholder="Rereads"
												/>
												<textarea bind:value={listItem.notes} name="notes" placeholder="Enter Note" />
											</div>
											<div class="e-3">
												<input
													type="number"
													id="chapters"
													name="chapters"
													min="0"
													bind:value={listItem.chapters}
													placeholder="Chapter"
												/>
												<input
													type="number"
													id="pages"
													name="pages"
													min="0"
													bind:value={listItem.pages}
													placeholder="Pages"
												/>
											</div>
										</div>
									</div>
								</div>
								<input name="title" type="hidden" bind:value={listItem.title} />
							</form>
						</div>

						<div id="overlay" in:fade={{ duration: 300 }} />
					{/if}
				</form>
			{/each}
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Caveat&family=Istok+Web&family=Poppins:wght@300&display=swap%27');
	* {
		font-family: 'Overpass', sans-serif;
		text-decoration: none;
		outline: none;
	}

	.material-icons {
		font-family: 'Material Icons';
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
		margin: 0 23%;
	}

	.listContainer {
		display: flex;
		flex-direction: column;
		padding: 1rem 0rem;
	}

	.list-head {
		color: #5c728a;
		font-weight: 700;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		margin: 0.3rem 0;
		border-radius: 3px;
		background-color: #fafafa;
		align-items: center;
		padding: 0.4rem 0.5rem;
	}

	.list-cover {
		width: 80px;
	}

	.contentWrapperHead {
		display: flex;
		align-items: start;
		width: 40%;
		justify-content: space-between;
	}

	.list-score {
		width: 20%;
		display: flex;
		justify-content: center;
	}

	.list-date {
		padding-left: 0.4em;
		width: 40%;
	}

	.list-progress {
		padding-left: 0.4rem;
		width: 40%;
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
		width: 60%;
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
		padding-left: 16px;
		font-weight: 700;
		font-size: 14px;
		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.score {
		font-family: 'Istok Web', sans-serif;
		display: flex;
		justify-content: center;
		color: #5c7289;
		border-radius: 13px;
		font-size: 14px;
		font-weight: 600;
		width: 20%;
		height: 26px;
		line-height: 28px;
	}

	.contentWrapper {
		display: flex;
		align-items: center;
		width: 40%;
		justify-content: space-between;
	}

	.progress {
		width: 40%;
		display: flex;
		font-size: 12px;
		align-items: center;
	}

	.dateSpan {
		width: 40%;
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

	.editor-popout {
		height: 50%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fafafa;
		box-shadow: 0 2px 5px rgb(0, 0, 0, 0.1);
		border-radius: 8px;
		z-index: 999;
		transition: opacity 0.3s ease-in;
	}

	.editor-banner {
		height: 150px;
		background-color: rgb(43, 45, 66, 0.99);
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		/* box-shadow: 0 2px 5px rgba(255, 255, 255, 1); */
	}

	.editor-header {
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-top: -1rem;
		padding-left: 2rem;
		padding-right: 3rem;
		width: inherit;
	}

	.bookdd {
		display: flex;
		align-items: baseline;
	}

	.editor-title {
		margin-left: 1rem;
		font-size: 17px;
		font-weight: 500;
		color: #fff;
		margin-bottom: 1rem;
	}

	.editor-cover img {
		/* position: fixed; */
		height: 100%;
		width: 5rem;
		border-style: none;
		border-radius: 5px;
		margin-bottom: -60%;
	}

	.ebutton button {
		border: none;
		border-radius: 5px;
		padding: 0.5rem;
		margin-bottom: 1rem;
		cursor: pointer;
		color: #fff;
		transition: background-color 0.3s ease;
	}

	.esave {
		background-color: #0277f5;
	}

	.edelete {
		background-color: #c0495d;
	}

	.esave:hover {
		background-color: #0089fa;
	}

	.edelete:hover {
		background-color: #e6556d;
	}

	.cancelButton {
		margin: 7px;
		border: none;
		outline: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		position: absolute;
		top: 0; /* Position the button at the top */
		right: 0; /* Position the button at the right */
		color: #fff;
		transition: all 0.3s ease-in-out;
	}

	.cancelButton .material-icons {
		display: inline-block;
		vertical-align: middle;
	}

	.cancelButton:hover {
		color: #c4ced8;
	}

	.editor-popout form {
		display: flex;
	}
	.editor-container {
		height: inherit;
		/* border-radius: 15px; */
		padding: 4rem 2rem;
		/* background-color: rgb(250, 250, 250, 0.96); */
	}

	.e-userStatus {
		display: flex;
		justify-content: space-between;
		width: 40rem;
		/* gap: 1rem; */
	}

	.e-userStatus select,
	.e-userStatus input,
	.e-userStatus textarea {
		margin-bottom: 1rem;

		align-items: end;
		padding: 0.4rem;
		color: #5c7289;
		border: none;
		border-radius: 4px;
		background-color: #edf1f5;
	}

	.e-userStatus textarea {
		width: 160%;
	}

	#overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		pointer-events: auto;
		backdrop-filter: blur(0.35px);
		background-color: rgb(43, 45, 66, 0.3);
	}
</style>
