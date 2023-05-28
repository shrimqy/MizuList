<script>
	/** @type {import('./$types').Actions} */
	export let data;
	let { work, bookData, isbn, favTag, existingBook } = data;
	import { Bar } from 'svelte-chartjs';
	// console.log(bookData);
	// console.log(work);
	console.log(existingBook);

	let inputValue = '';
	let startDate = null;
	let finishDate = null;

	// console.log(isbn);
	let status = 'planToRead';
	let selectedCategoryId = existingBook ? existingBook.bookCategory[1].id : status;
	let selectedRating = existingBook ? existingBook.rating : '0';
	let pageCount = existingBook ? existingBook.pages : null;
	let chapterCount = existingBook ? existingBook.chapters : null;
	let rereads = existingBook ? existingBook.rereads : null;
	const createdAt = existingBook ? existingBook.createdAt : null;
	const completedAt = existingBook ? existingBook.completedAt : null;
	if (createdAt !== null) {
		startDate = createdAt.toISOString().split('T')[0];
	}
	if (completedAt !== null) {
		finishDate = completedAt.toISOString().split('T')[0];
	}
	function resetForm() {
		status = 'default';
	}

	let showForm = false;

	function toggleForm() {
		showForm = !showForm;

		const container = document.querySelector('.container');
		container.classList.toggle('blur');
	}

	//to select the default option when the add to list button is clicked upon
	function setDefaultStatus() {
		document.getElementById('addToListButton').style.display = 'none';
		document.getElementById('status').style.display = 'inline';
		document.getElementById('defaultOption').selected = true;
		status = 'planToRead';
	}
	let showMore = false;
	const maxTagsToShow = 15; // Define the maximum number of tags to show initially

	function toggleShowMore() {
		showMore = !showMore;
	}

	//to filter tags to an appropriate styling
	function filterTags(tags) {
		const filteredTags = tags.filter((tag) => {
			if (typeof tag !== 'string') return false;
			return /^[a-zA-Z\s(){}[\]&.,'-]+$/.test(tag);
		});

		return filteredTags.map((tag) => {
			const words = tag.split(' ');
			return words
				.map((word, index) => {
					if (/^[\(\[].*[\)\]]$/.test(word)) {
						return word;
					} else if (word.includes('-')) {
						const subWords = word.split('-');
						const capitalizedSubWords = subWords.map((subWord) => {
							return subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase();
						});
						return capitalizedSubWords.join('-');
					} else {
						return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
					}
				})
				.join(' ');
		});
	}

	//review
	let isExpanded = false;
	let buttonText = 'See More';
	const characterLimit = 300;

	let reviewText =
		'Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor, Lorem ipsum dolor sit ametermentum tristiqueuat dolor,  Lorem ipsum dolor sit ametermentum tristiqueuat dolor,  Lorem ipsum dolor sit ametermentum tristiqueuat dolor,  Lorem ipsum dolor sit ametermentum tristiqueuat dolor,';

	let truncatedReviewText = reviewText.substring(0, characterLimit) + '...'; //stores the truncated version of the review text based on the character limit.
	let isTextTruncated = reviewText.length > characterLimit; //indicates whether the review text has been truncated or not.
	//resposbile for toggling the expansion state of the content
	function toggleExpansion() {
		isExpanded = !isExpanded;
		buttonText = isExpanded ? 'Show Less' : 'Read More';
	}
</script>

<div class="banner" />
<div class="container">
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
				{:else}
					<span>No cover available</span>
				{/if}
			</div>

			<div class="userFav">
				{#if !favTag}
					<form action="?/addFav" method="POST">
						<button formaction="?/addFav">Add to Favorites</button>
					</form>
				{/if}
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
				<form method="POST" action="?/userStatus" class="userStatus">
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
					<input
						class="chapter"
						type="number"
						id="chapters"
						name="chapters"
						bind:value={chapterCount}
						placeholder="Chapter "
					/>
					<input
						class="pages"
						type="number"
						id="pages"
						name="pages"
						bind:value={pageCount}
						placeholder="Pages "
					/>

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

					{#if showForm}
						<div class="editor-popout">
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
													<option value={4}>On Hold</option>
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
												<input type="number" id="rereads" bind:value={rereads} name="rereads" />
												<textarea bind:value={inputValue} placeholder="Enter Note" />
											</div>
											<div class="e-3">
												<input
													type="number"
													id="chapters"
													name="chapters"
													bind:value={chapterCount}
													placeholder="Chapter"
												/>
												<input
													type="number"
													id="pages"
													name="pages"
													bind:value={pageCount}
													placeholder="Pages"
												/>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>

						<div id="overlay" />
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
					<div class="ed">
						<h2>Format</h2>
						<h3>{isbn.number_of_pages} pages, {isbn.physical_format}</h3>
					</div>
					<div class="ed">
						<h2>Publish Date</h2>
						<h3>{isbn.publish_date} by {isbn.publishers}</h3>
					</div>
				</div>
			</div>
			<div class="review">
				<h3 style="padding-bottom: 1rem;">Reviews</h3>
				<div class="review-container">
					<img
						src="https://cdn.myanimelist.net/s/common/userimages/ccd5d0a5-a3f5-4026-8c7d-d863a04f689a_225w?s=a5ee9982a49a58929103f3961d051a53"
						alt="User Avatar"
						class="user-avatar"
					/>
					<div class="review-body">
						<div class="review-header">
							<h3 class="user-name">John Doe</h3>
							<span class="review-date">May 18, 2023</span>
						</div>

						<div class="review-content">
							<!-- conditionally display either reviewText or truncatedReviewText based on the isExpanded variable. -->
							<p class="review-text">{isExpanded ? reviewText : truncatedReviewText}</p>
						</div>
						{#if isTextTruncated}
							<button class="see-more-btn" on:click={toggleExpansion}>
								{#if isExpanded}
									<span class="material-icons">expand_less</span>{:else}
									<span class="material-icons">expand_more</span>
								{/if}{buttonText}
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
	}

	.material-icons {
		font-family: 'Material Icons';
	}

	:root {
		background-color: #edf1f5;
	}

	.banner {
		background-color: #2b2d42;
		height: 100px;
	}

	.container {
		width: 100%;
	}
	.bcontainer {
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

	.review-container {
		display: flex;
		background-color: #fafafa;
		border-radius: 7px;
		padding: 1rem;
	}

	.review-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.user-avatar {
		height: 54px;
		border-radius: 50%;
		margin-right: 2rem;
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
		margin-bottom: 10px;
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

	.userFav button {
		width: 12rem;
		color: #dff3fd;
		font-family: 'Poppins', sans-serif;
		font-size: 14px;
		border: none;
		border-radius: 4px;
		background-color: #1faafa;
		cursor: pointer;
		padding: 0.5rem 1rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		transition: background-color 0.3s ease-in-out;
	}

	.userFav button:hover {
		background-color: #52c3f9;
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
		background-color: #007bff;
		color: #fff;
		transition: background-color 0.3s ease;
	}

	.sbutton:hover,
	.listEditor:hover {
		background-color: #0056b3;
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
		display: none;
		position: absolute;
		background-color: #f9f9f9;
		min-width: 160px;
		z-index: 1;
	}

	.dropdown-content button {
		margin-top: 0.1rem;
		border-radius: 4px;
		border: none;
		display: block;
		padding: 0.5rem;
		text-align: left;
	}

	.dropdown:hover .dropdown-content {
		display: block;
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
	}

	.cancelButton .material-icons {
		display: inline-block;
		vertical-align: middle;
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

	/* .e-2 input {
		width: 10rem;
		margin-right: 1rem;
		padding: 0.4rem;
		color: #5c7289;
		border: none;
		border-radius: 4px;
		background-color: #edf1f5;
	} */

	#overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		backdrop-filter: blur(0.35px);
		background-color: rgb(43, 45, 66, 0.3);
	}
</style>
