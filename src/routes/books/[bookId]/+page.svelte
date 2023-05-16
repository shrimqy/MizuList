<script>
	export let data;
	let { work, bookData } = data;
	console.log(bookData);
	console.log(work);
	let status = 'planToRead';

	function resetForm() {
		status = 'default';
	}
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
			<img
				src={'http://covers.openlibrary.org/b/id/' + work.covers[0] + '-L.jpg?default=false'}
				alt={work.title}
				class="cover"
			/>
			<div class="userFav">
				<form action="">
					<button>Add to Favorites</button>
				</form>
			</div>
		</div>

		<div class="content">
			<div class="title">{work.title}</div>
			<div class="author">{bookData.author_name}</div>
			<div class="desc">{work.description?.value || work.description || ''}</div>
			<div class="userStatus">
				<form>
					<button id="addToListButton" on:click={setDefaultStatus}>Add to List</button>
					<select id="status" bind:value={status} style="display: none;">
						<option value="reading">Reading</option>
						<option value="planToRead" id="defaultOption">Plan to Read</option>
						<option value="onHold">On Hold</option>
						<option value="dropped">Dropped</option>
						<option value="completed">Completed</option>
					</select>
					<select id="rating">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</select>
					<input type="number" id="chapters" placeholder="Chapter: " />
					<input type="number" id="pages" placeholder="Pages: " />

					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	</div>
	<div class="sidebar">
		<div class="data" />
		<div class="tag-container">
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
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
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

	.tag-container {
		margin: 0 16rem;
		width: 12rem;
		height: 100%;
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
		background-color: #fff;
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

	.dataCover {
		width: 12rem;
	}

	.cover {
		margin-top: -35%;
		height: 17rem;
		width: inherit;
		border-style: none;
		border-radius: 2px;
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
	}

	.userFav button {
		width: 12rem;
		color: #dff3fd;
		font-family: 'Poppins', sans-serif;
		font-size: 14px;
		border: none;
		border-radius: 7px;
		background-color: #1faafa;
		cursor: pointer;
		padding: 0.5rem 1rem;
		transition: background-color 0.3s ease-in-out;
	}

	.userFav button:hover {
		background-color: #52c3f9;
	}
	.content {
		display: flex;
		flex-direction: column;
		margin-left: 3rem;
		margin-top: 1rem;
		color: #5e5e5e;
	}

	.title {
		font-size: 19px;
		color: #5c7289;
		font-weight: 600;
	}

	.author {
		margin: 0.4rem 0rem;
		font-size: 16px;
		font-weight: 500;
	}

	.userStatus {
		display: flex;
		padding-bottom: 2rem;
	}

	.desc {
		padding: 2rem 0rem;
	}
</style>
