<script>
	/** @type {import('./$types').Actions} */
	export let data;
	let { work, bookData, isbn } = data;
	import { Bar } from 'svelte-chartjs';
	console.log(bookData);
	console.log(work);
	console.log(isbn);

	let status = 'planToRead';

	function resetForm() {
		status = 'default';
	}

	//to select teh default option when the add to list button is clicked upon
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
				<form action="?/addFav" method="POST">
					<button formaction="?/addFav">Add to Favorites</button>
				</form>
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
				<form class="userStatus">
					<button class="fbutton" id="addToListButton" on:click={setDefaultStatus}
						>Add to List</button
					>
					<select class="status" id="status" bind:value={status}>
						<option value="reading">Reading</option>
						<option value="planToRead" id="defaultOption">Plan to Read</option>
						<option value="onHold">On Hold</option>
						<option value="dropped">Dropped</option>
						<option value="completed">Completed</option>
					</select>
					<select class="rating" id="rating">
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
					<input class="chapter" type="number" id="chapters" placeholder="Chapter " />
					<input class="pages" type="number" id="pages" placeholder="Pages " />

					<button class="sbutton" type="submit">Submit</button>
				</form>
			</div>
			<div class="desc">{work.description?.value || work.description || ''}</div>
		</div>
	</div>

	<div class="content-container">
		<div class="sidebar">
			<div class="book-details">
				<h2>First publish Date</h2>
				<h3>{bookData.first_publish_year}</h3>
				<h2>Publishers</h2>
				<h3>{bookData.publisher.slice(0, 10).join(', ')}</h3>
				<h2>No of Pages</h2>
				<h3>{bookData.number_of_pages_median} (Average)</h3>
				<h2>Languages</h2>
				<h3>{bookData.language.join(', ')}</h3>
				<h2>Edition Count</h2>
				<h3>{bookData.edition_count}</h3>
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
							<p class="review-text">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper nulla nec
								fermentum tristique. Nulla ut condimentum felis, vitae dapibus ligula. Praesent ac
								rhoncus lorem. Sed nec consequat dolor, sed viverra odio.
							</p>
						</div>
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

	:root {
		background-color: #edf1f5;
	}

	.banner {
		margin: 0px -8px;
		background-color: #2b2d42;
		height: 100px;
	}

	.container {
		margin: 0 -8px;
	}

	.bcontainer {
		padding: 0 16rem;
		background-color: #fafafa;
		display: flex;
	}

	.content-container {
		display: flex;
		padding-left: 16rem;
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
		margin-right: 8px;
		border-radius: 3px;
		box-sizing: border-box;
	}

	.overview {
		color: #5c728a;
		display: flex;
		flex-direction: column;
		margin-left: 3rem;
		margin-right: 16rem;
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
		/* align-items: center; */
		padding-top: 1rem;
		padding-left: 1rem;
		/* padding-bottom: 1rem; */
	}

	.edition-details .ed h2 {
		width: 7rem;
		font-size: 14px;
		font-weight: 600;
	}

	.edition-details .ed h3 {
		/* margin-top: 0; */
		margin-left: 1rem;
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
		margin-right: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.review-body {
		/* margin-right: 1rem; */
		margin-bottom: 1rem;
	}

	.user-avatar {
		width: 42px;
		height: 52px;
		border-radius: 5px;
		margin-right: 2rem;
	}

	.user-name {
		margin: 0;
		font-size: 18px;
		font-weight: bold;
	}

	.review-date {
		font-size: 14px;
		color: #999;
	}

	.review-text {
		margin-bottom: 10px;
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

	.sbutton {
		cursor: pointer;
	}
</style>
