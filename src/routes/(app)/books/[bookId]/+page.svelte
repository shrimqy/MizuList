<script>
	/** @type {import('./$types').Actions} */

	import { formatDate, filterTags } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';

	export let data;
	let { work, bookData, isbn, existingBook, reviews } = data;
	$: favTag = data.favTag;
	import { page } from '$app/stores';

	let startDate = null;
	let finishDate = null;

	let status = 'planToRead';
	let selectedCategoryId = existingBook ? existingBook.bookCategory[1].id : status;
	let selectedRating = existingBook ? existingBook.rating : '0';
	let pageCount = existingBook ? existingBook.pages : null;
	let chapterCount = existingBook ? existingBook.chapters : null;
	let rereads = existingBook ? existingBook.rereads : null;
	let notes = existingBook ? existingBook.notes : null;
	const createdAt = existingBook ? existingBook.createdAt : null;
	const completedAt = existingBook ? existingBook.completedAt : null;
	if (createdAt !== null) {
		startDate = createdAt.toISOString().split('T')[0];
	}
	if (completedAt !== null) {
		finishDate = completedAt.toISOString().split('T')[0];
	}

	let showForm = false;

	function toggleForm() {
		showForm = !showForm;
	}

	//to select the default option when the add to list button is clicked on
	function setDefaultStatus() {
		document.getElementById('addToListButton').style.display = 'none';
		document.getElementById('status').style.display = 'inline';
		document.getElementById('defaultOption').selected = true;
		status = 'planToRead';
	}

	//reviewtoggle
	let showMore = false;
	const maxTagsToShow = 15; // Define the maximum number of tags to show initially

	function toggleShowMore() {
		showMore = !showMore;
	}

	// Review
	let isExpanded = [];
	const characterLimit = 1000;

	function toggleExpansion(reviewIndex) {
		isExpanded[reviewIndex] = !isExpanded[reviewIndex];
	}

	//Fav Action
	const Fav = () => {
		return async ({ result, update }) => {
			if (result.data.success) {
				toast.push('Favorite Updated!', {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(72,187,120,0.9)',
						'--toastBarBackground': '#2F855A'
					}
				});
			}
			await update();
			invalidateAll();
		};
	};

	//status Action
	const statusUpdate = () => {
		return async ({ result, update }) => {
			if (result.data.success) {
				toast.push('Book Updated!', {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(72,187,120,0.9)',
						'--toastBarBackground': '#2F855A'
					}
				});
			}
			await update({ reset: false });
			await invalidateAll();
		};
	};
</script>

<title>{work.title}</title>

<!-- Toast Component -->
<div class="wrap">
	<SvelteToast />
</div>

<div class="banner" />
<div class="container" in:fade={{ duration: 500 }}>
	<div class="bcontainer">
		<div class="dataCover">
			<div class="cover">
				{#if work.covers && work.covers.length > 0}
					<img
						src={'http://covers.openlibrary.org/b/id/' + work.covers[0] + '-M.jpg?default=false'}
						alt={'work.title'}
					/>
				{:else if bookData.cover_edition_key && bookData.cover_edition_key.length > 0}
					<img
						src={'https://covers.openlibrary.org/b/olid/' +
							bookData.cover_edition_key +
							'-M.jpg?default=false'}
						alt={'work.title'}
					/>
				{:else if isbn.isbn_10 || isbn.isbn_13.length > 0}
					<img
						src={'https://covers.openlibrary.org/b/isbn/' +
							isbn.isbn_13[0] +
							'-M.jpg?default=false'}
						alt={'work.title'}
					/>
				{:else}
					<span>No cover available</span>
				{/if}
			</div>

			<div class="userFav">
				{#key (favTag, $page.data.user)}
					{#if !favTag || !$page.data.user}
						<form action="?/addFav" method="POST" use:enhance={Fav}>
							<button class="addFavButton" formaction="?/addFav">
								Add to Favorites
								<span class="material-icons-outlined"> favorite_border </span>
							</button>
						</form>
					{:else}
						<form action="?/addFav" method="POST" use:enhance={Fav}>
							<button class="addFavButton" formaction="?/addFav">
								Remove from Favorites
								<span class="material-symbols-outlined"> favorite </span>
							</button>
						</form>
					{/if}
				{/key}
			</div>
		</div>

		<div class="content">
			<div class="title">{work.title}</div>

			<div class="bookStats-header">
				<div class="rating-header">
					<div class="score">
						<h2>Score</h2>
						<h3>{(bookData.ratings_average * 2).toFixed(2)}</h3>
						<span class="r-count">{bookData.ratings_count} users</span>
					</div>
					<div class="detail-header">
						<div class="member" style="padding: 1rem 0rem;">
							Member: <span style="font-weight: 700; padding-left: 0.3rem"
								>{bookData.readinglog_count}</span
							>
						</div>
						<div class="author" style="font-size: 13px">
							Author: <span class="a-tag">{bookData.author_name}</span>
						</div>
					</div>
				</div>
				<form method="POST" action="?/userStatus" class="userStatus" use:enhance={statusUpdate}>
					{#if existingBook == null}
						<button class="fbutton" id="addToListButton" on:click|preventDefault={setDefaultStatus}
							>Add to List</button
						>
					{/if}

					<select
						class="status"
						id="status"
						name="status"
						bind:value={selectedCategoryId}
						style={existingBook ? 'display: inline' : 'display: none'}
					>
						<option value={2}>Reading</option>
						<option value={3} id="defaultOption">Plan to Read</option>
						<option value={4}>On Hold</option>
						<option value={5}>Dropped</option>
						<option value={6}>Completed</option>
					</select>
					<select class="rating" name="rating" id="rating" bind:value={selectedRating}>
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
					<div class="input">
						Chapters:
						<input
							class="chapter"
							type="number"
							id="chapters"
							name="chapters"
							min="0"
							bind:value={chapterCount}
						/>
					</div>
					<div class="input">
						Pages:
						<input
							class="pages"
							min="0"
							type="number"
							id="pages"
							name="pages"
							bind:value={pageCount}
						/>
					</div>

					<!-- List-Editor-dropdown-menu -->
					<div class="dropdown">
						<button formaction="?/userStatus" class="sbutton" type="submit"
							>Submit <span class="material-icons">expand_more</span></button
						>
						<div class="dropdown-content">
							<button class="listEditor" on:click|preventDefault={toggleForm}
								>Open List editor</button
							>
						</div>
					</div>

					<!-- List-Editor -->
					{#if showForm}
						<div class="editor-popout" transition:fade={{ duration: 300 }}>
							<form method="POST" action="?/userStatus">
								<div class="editor">
									<div class="editor-banner">
										<button type="button" class="cancelButton" on:click={toggleForm}>
											<span class="material-icons">close</span></button
										>

										<div class="editor-header">
											<div class="bookdd">
												<div class="editor-cover">
													{#if work.covers && work.covers.length > 0}
														<img
															src={'http://covers.openlibrary.org/b/id/' +
																work.covers[0] +
																'-M.jpg?default=false'}
															alt={'work.title'}
														/>
													{:else if bookData.cover_edition_key && bookData.cover_edition_key.length > 0}
														<img
															src={'https://covers.openlibrary.org/b/olid/' +
																bookData.cover_edition_key +
																'-M.jpg?default=false'}
															alt={'work.title'}
														/>
													{:else}
														<span>No cover available</span>
													{/if}
												</div>
												<div class="editor-title">{work.title}</div>
											</div>

											<div class="ebutton">
												<button formaction="?/userStatus" type="submit">Save</button>
											</div>
										</div>
									</div>
									<div class="editor-container">
										<div class="e-userStatus">
											<div class="e-1">
												<select id="status" name="status" bind:value={selectedCategoryId}>
													<option value={2}>Reading</option>
													<option value={3} id="defaultOption">Plan to Read</option>
													<option value={4}>Paused</option>
													<option value={5}>Dropped</option>
													<option value={6}>Completed</option>
												</select>
												<input
													type="date"
													bind:value={startDate}
													name="startDate"
													placeholder="Start Date"
												/>
												<input
													type="date"
													bind:value={finishDate}
													name="finishDate"
													placeholder="Finish Date"
												/>
											</div>

											<div class="e-2">
												<select
													class="e-rating"
													name="rating"
													id="rating"
													bind:value={selectedRating}
												>
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
													bind:value={rereads}
													min="0"
													name="rereads"
													placeholder="Rereads"
												/>
												<textarea bind:value={notes} name="notes" placeholder="Enter Note" />
											</div>
											<div class="e-3">
												<input
													type="number"
													id="chapters"
													name="chapters"
													min="0"
													bind:value={chapterCount}
													placeholder="Chapter"
												/>
												<input
													type="number"
													id="pages"
													name="pages"
													min="0"
													bind:value={pageCount}
													placeholder="Pages"
												/>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>

						<div id="overlay" transition:fade={{ duration: 300 }} />
					{/if}
				</form>
			</div>
			<div class="desc">{work.description?.value || work.description || ''}</div>
		</div>
	</div>

	<div class="content-container">
		<div class="sidebar">
			<div class="book-details">
				<h2>First publish Date</h2>
				<h3>{bookData.first_publish_year || 'N/A'}</h3>
				<h2>Publishers</h2>
				<h3>{bookData.publisher ? bookData.publisher.slice(0, 10).join(', ') : 'N/A'}</h3>
				<h2>No of Pages</h2>
				<h3>
					{bookData.number_of_pages_median ? bookData.number_of_pages_median + ' (Average)' : 'N/A'}
				</h3>
				<h2>Languages</h2>
				<h3>{bookData.language ? bookData.language.join(', ') : 'N/A'}</h3>
				<h2>Edition Count</h2>
				<h3>{bookData.edition_count || 'N/A'}</h3>
				<a class="amazonLink" href="https://www.amazon.in/s?k={bookData.title}" target="_blank">
					<h2>Amazon</h2>
					<span class="material-icons-outlined"> open_in_new </span>
				</a>
			</div>
			<div class="tag-container">
				{#if bookData.subject && bookData.subject.length > 0}
					<h3>Tags</h3>
					{#each filterTags(bookData.subject.slice(0, 15)) as subject}
						<div class="tags">{subject}</div>
					{/each}

					{#if bookData.subject.length > maxTagsToShow && !showMore}
						<button on:click={toggleShowMore}>Show More</button>
					{:else if showMore}
						{#each filterTags(bookData.subject.slice(maxTagsToShow)) as subject}
							<div class="tags">{subject}</div>
						{/each}
						{#if bookData.subject.length > maxTagsToShow}
							<button on:click={toggleShowMore}>Show Less</button>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
		<div class="overview">
			<div class="edition-container" style="margin-bottom: 1rem;">
				<h3 style="color: #61778f">Edition Details</h3>
				<div class="edition-details">
					{#if isbn}
						<div class="ed">
							<h2>Format</h2>
							<h3>{isbn.number_of_pages} pages, {isbn.physical_format}</h3>
						</div>
						<div class="ed">
							<h2>Publish Date</h2>
							<h3>{isbn.publish_date} by {isbn.publishers}</h3>
						</div>
					{:else}
						<div class="ed">No Edition Details Available</div>
					{/if}
				</div>
			</div>
			<div class="review">
				<div class="review-head">
					<h3 style="color: #61778f">Reviews</h3>
					{#if existingBook && existingBook.bookId && existingBook.bookId.length > 0}
						<a data-sveltekit-preload-data href="/books/{existingBook.bookId}/review"
							>Write a review</a
						>
					{:else if $page.data.user}
						<a href={null}>Write a review</a>
					{:else}
						<a href="/login">Write a review</a>
					{/if}
				</div>

				{#each reviews as review, reviewIndex}
					<div class="review-container">
						<img src={`/uploads/${review.user.id}.png`} alt="User Avatar" class="user-avatar" />
						<div class="review-body">
							<div class="review-header">
								<h3 class="user-name">{review.user.username}</h3>
								<span class="review-date">{formatDate(review.date, 'reviewDate')}</span>
							</div>

							<div class="review-tags">
								{#if review.recommendation == 'Mixed Feelings'}
									<div class="rtag" style="border: 1px solid #787878; color: #787878">
										<span class="material-icons-outlined">star_half</span>
										{review.recommendation}
									</div>
								{:else if review.recommendation == 'Recommended'}
									<div class="rtag" style="border: 1px solid #26448f; color: #26448f">
										<span class="material-icons-outlined">star</span>
										{review.recommendation}
									</div>
								{:else}
									<div class="rtag" style="border: 1px solid #a12f31; color: #a12f31">
										<span class="material-icons-outlined">star_outline</span>
										{review.recommendation}
									</div>
								{/if}

								{#if review.spoiler == 'true'}
									<div class="rtag" style="border: 1px solid #ff2c55; color: #ff2c55">Spoiler</div>
								{/if}
							</div>

							<div class="review-content">
								<!-- conditionally display either reviewText or truncatedReviewText based on the isExpanded variable -->
								<p class="review-text">
									{#if isExpanded[reviewIndex]}
										{review.review}
									{:else}
										{review.review.slice(0, characterLimit) + '...'}
									{/if}
								</p>
							</div>

							{#if review.review.length > characterLimit}
								<button class="see-more-btn" on:click={() => toggleExpansion(reviewIndex)}>
									{#if isExpanded[reviewIndex]}
										<span class="material-icons">expand_less</span>
									{:else}
										<span class="material-icons">expand_more</span>
									{/if}
									{isExpanded[reviewIndex] ? 'Read Less' : 'Read More'}
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
	}

	.material-icons {
		font-family: 'Material Icons';
	}

	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
	}

	.material-icons-outlined {
		font-family: 'Material Icons';
	}

	.container {
		width: 100%;
		background-color: #edf1f5;
	}

	.bcontainer {
		padding-top: 1rem;
		background-color: #fafafa;
		display: flex;
		justify-content: center;
	}

	.content-container {
		display: flex;
		justify-content: center;
	}

	.sidebar {
		margin-top: 1rem;
		width: 12rem;
		height: 100%;
	}

	.book-details {
		display: flex;
		flex-direction: column;
		background-color: #fafafa;
		width: inherit;
		font-size: 11px;
		padding: 6px 15px;
		margin-bottom: 0.9rem;

		margin-right: 8px;
		border-radius: 3px;
		box-sizing: border-box;
	}

	.book-details h2 {
		margin: 0.3rem 0rem;
		font-size: 14px;
		color: #6e8297;
	}

	.book-details h3 {
		margin: 0.3rem 0rem;
		font-size: 12px;
		font-weight: 400;
		color: #9299a1;
	}

	.book-details h3 {
		white-space: pre-wrap;
	}

	.amazonLink {
		color: #6e8297;
		text-decoration: none;
		display: flex;
		align-items: start;
	}

	.amazonLink span {
		margin: 0.35rem 0rem;
		font-size: 14px;
		font-weight: 600;
	}

	.tag-container h3 {
		color: #7a8ea3;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-weight: 500;
		font-size: 15px;
		margin-bottom: 1.5rem;
	}

	.tags {
		display: flex;
		background-color: #fafafa;
		width: inherit;
		font-size: 13px;
		font-weight: 400;
		color: #5c728a;
		padding: 6px 15px;
		margin-bottom: 0.9rem;
		border-radius: 3px;
		box-sizing: border-box;
	}

	.overview {
		color: #5c728a;
		display: flex;
		flex-direction: column;
		width: 50rem;
		margin-left: 3rem;
		margin-top: 1rem;
	}

	.edition-details {
		padding-bottom: 1rem;
		margin-top: 1rem;
		background-color: #fafafa;
		border-radius: 3px;
	}

	.edition-details .ed {
		display: flex;
		padding-top: 1rem;
		padding-left: 1rem;
	}

	.edition-details .ed h2 {
		width: 7rem;
		font-size: 14px;
		font-weight: 600;
	}

	.edition-details .ed h3 {
		/* margin-left: 1rem; */
		font-size: 14px;
		font-weight: 500;
	}

	.review-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-bottom: 1rem;
	}

	.review-head a {
		color: #0089fa;
		font-weight: 500;
		transition: all ease-in-out 0.3s;
	}

	.review-head a:hover {
		color: #005bff;
	}

	.review .review-container {
		display: flex;
		background-color: #fafafa;
		border-radius: 7px;
		padding: 1rem;
		margin: 1rem 0;
	}

	.review-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.user-avatar {
		height: 54px;
		width: 54px;
		border-radius: 50%;
		margin-right: 2rem;
		object-fit: cover;
	}

	.user-name {
		font-size: 15px;
		font-weight: bold;
	}

	.review-date {
		font-size: 14px;
		color: #999;
	}

	.review-text {
		font-family: Verdana, Arial, Helvetica, sans-serif;
		color: #1e1915;
		margin-bottom: 10px;
		line-height: 20px;
		font-size: 12px;
		word-spacing: px;
		white-space: pre-wrap;
		overflow: hidden;
		transition: max-height 0.5s ease-in-out;
	}

	.see-more-btn {
		display: flex;
		align-items: center;
		font-weight: 500;
		color: #5c7289;
		background-color: #fafafa;
		border: none;
		cursor: pointer;
		padding: 0.2rem 0rem;
		transition: 0.2s ease;
	}

	.see-more-btn span {
		font-weight: 500;
	}

	.see-more-btn:hover {
		color: #1faafa;
	}

	.dataCover {
		width: 12rem;
		display: flex;
		justify-content: start;
		flex-direction: column;
	}

	.cover span {
		display: flex;
		justify-content: center;
		margin-top: 50%;
	}

	.cover img {
		margin-top: 1rem;
		height: 17rem;
		width: 12rem;
		border-style: none;
		border-radius: 3px;
		box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.2);
	}

	.addFavButton {
		color: #ff2c55;
		font-weight: 500;
		font-family: 'Poppins', sans-serif;
		display: flex;
		font-size: 12px;
		justify-content: center;
		align-items: center;
		width: 12rem;
		border: 1px solid #ff2c55;
		border-radius: 4px;
		background-color: #fff;
		cursor: pointer;
		padding: 0.6rem 0.5rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		transition: background-color 0.3s ease-in-out;
	}

	.addFavButton span {
		font-size: 15px;
		padding-left: 0.5rem;
	}

	.userFav button:hover {
		background-color: #ff2c560e;
	}
	.content {
		display: flex;
		flex-direction: column;
		width: 50rem;
		margin-left: 3rem;
		margin-top: 1rem;
		color: #5e5e5e;
	}

	.title {
		font-size: 25px;
		color: #5c7289;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.bookStats-header {
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		border: none;
		border-radius: 6px;
		padding-left: 1rem;
	}

	.rating-header {
		display: flex;
		margin: 1rem 1rem;
	}

	.r-count {
		display: flex;
		justify-content: center;
		font-size: 11px;
		margin-top: 0rem;
	}

	.score {
		width: 5rem;
		display: flex;
		flex-direction: column;
		border-radius: 0px;
		border-right: 2px solid rgb(229, 231, 235);
		padding-right: 1rem;
	}
	.score h2 {
		display: flex;
		justify-content: center;
		padding: 0.3rem 0rem;
		font-size: 13px;
		font-weight: 500;
		background-color: #1faafa;
		color: #fff;
		border-radius: 6px;
	}

	.score h3 {
		font-size: 29px;
		display: flex;
		justify-content: center;
		color: #5c7289;
		border: none;
		padding-top: 0.5rem;
	}

	.detail-header {
		padding: 0rem 1rem;
		font-size: 17px;
		font-weight: 500;
	}

	.a-tag {
		font-weight: 300;
		color: #1faafa;
		padding-left: 0.3rem;
	}

	.desc {
		padding: 2rem 0rem;
		font-size: 13px;
		word-spacing: 1.5px;
	}

	.userStatus {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.userStatus > * {
		margin-right: 0.5rem;
	}

	.userStatus > *:last-child {
		margin-right: 0;
	}

	.status {
		cursor: pointer;
		display: none;
		border: none;
		width: 7rem;
		border-radius: 4px;
		background-color: white;
		padding: 0.3rem 0.5rem;
	}

	.input {
		border-radius: 4px;
		background-color: white;
		padding: 0.1rem 0.5rem;
	}

	.chapter,
	.pages,
	.sbutton,
	.rating,
	.fbutton {
		border: none;
		border-radius: 4px;
		background-color: white;
		padding: 0.3rem 0.5rem;
	}

	.pages,
	.chapter {
		width: 6rem;
	}

	.fbutton {
		width: 7rem;
		cursor: pointer;
	}

	.sbutton,
	.listEditor {
		display: flex;
		align-items: center;
		cursor: pointer;
		background-color: #fff;
		color: #000;
		transition: background-color 0.3s ease;
	}

	.dropdown-content button {
		width: max-content;
	}

	.sbutton:hover,
	.listEditor:hover {
		background-color: #0057b313;
	}

	.sbutton span {
		padding-left: 3px;
		font-size: 19px;
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		opacity: 0;
		position: absolute;
		z-index: 1;
	}

	.dropdown-content button {
		margin-top: 0.2rem;
		border-radius: 4px;
		border: none;
		display: block;
		padding: 0.5rem;
		text-align: left;
	}

	.dropdown:hover .dropdown-content {
		opacity: 1;
		transition: 0.3s ease-in-out;
	}

	.editor-popout {
		height: 60%;
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
		height: inherit;
		display: flex;
		justify-content: space-between;
		align-items: end;
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
		background-color: #007bff;
		color: #fff;
		transition: background-color 0.3s ease;
	}

	.ebutton button:hover {
		background-color: #0089fa;
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

	.review-tags {
		display: flex;
		gap: 2%;
		font-size: 13px;
		margin-bottom: 1rem;
	}

	.rtag {
		display: flex;
		border-radius: 5px;
		padding: 0.2rem 0.5rem;
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
