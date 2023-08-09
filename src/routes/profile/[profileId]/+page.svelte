<script>
	import { page } from '$app/stores';
	import { formatDate, filterTags } from '$lib/utils';
	import { fade } from 'svelte/transition';
	$: lastActivity = $page.data.lastActivity;
	$: existingBook = $page.data.existingBook;
	$: stats = $page.data.stats;
	$: fav = $page.data.fav;
	$: userData = $page.data.userData;

	$: rereads = existingBook.filter((item) => item.rereads !== null && item.rereads !== '').length;

	$: uniqueLastActivity = lastActivity?.filter(
		(activity, index, self) => index === self.findIndex((a) => a.bookId === activity.bookId)
	);

	$: filteredRating = existingBook.filter(
		(item) => item.rating !== null && item.rating !== '' && item.rating !== '0'
	);
	$: sum = filteredRating.reduce((acc, item) => acc + parseFloat(item.rating), 0);
	$: averageRating = (sum / filteredRating.length).toFixed(2);
</script>

<title>{userData.username}'s Profile</title>
<div class="container" in:fade={{ duration: 300 }}>
	<div class="analytics">
		<div class="left-section">
			{#if userData?.bio}
				<div class="bio">
					<h1>Bio</h1>
					<p>{userData.bio}</p>
				</div>
			{/if}

			<div class="statistics">
				<h1>Statistics</h1>
				<div class="sContainer">
					<div class="sOverview">
						<div class="sData">
							<div class="data">{existingBook.length}</div>
							<div class="header">Total Entries</div>
						</div>
						<div class="sData">
							<div class="data">{rereads}</div>
							<div class="header">Rereads</div>
						</div>
						<div class="sData">
							<div class="data">{averageRating}</div>
							<div class="header">Mean Score</div>
						</div>
					</div>
					<div class="sList">
						<div class="listContainer">
							<div class="listItem">
								<span class="material-icons" style="color:#2DB039;"> circle </span>
								<a href="/profile/list">Reading</a>
							</div>

							<div class="listData">{stats[1].Book.length}</div>
						</div>

						<div class="listContainer">
							<div class="listItem">
								<span class="material-icons" style="color:#C3C3C3"> circle </span>
								<a href="/profile/list/Planning">Plan to Read</a>
							</div>

							<div class="listData">{stats[2].Book.length}</div>
						</div>

						<div class="listContainer">
							<div class="listItem">
								<span class="material-icons" style="color:#F9D457"> circle </span>
								<a href="/profile/list/Paused">Paused</a>
							</div>

							<div class="listData">{stats[3].Book.length}</div>
						</div>

						<div class="listContainer">
							<div class="listItem">
								<span class="material-icons" style="color:#A12F31"> circle </span>
								<a href="/profile/list/Dropped">Dropped</a>
							</div>

							<div class="listData">{stats[4].Book.length}</div>
						</div>

						<div class="listContainer">
							<div class="listItem">
								<span class="material-icons" style="color:#26448F"> circle </span>
								<a href="/profile/list/Completed">Completed</a>
							</div>

							<div class="listData">{stats[5].Book.length}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="activity">
			<h1>Activity</h1>
			<div class="aContainer">
				{#each uniqueLastActivity.slice(0, 5) as book}
					<div class="bookCard">
						<div class="titleCover">
							{#if book.bookId}
								<!-- Book cover source -->

								<div class="imageContainer">
									<img
										src={'https://covers.openlibrary.org/b/olid/' +
											book.covers +
											'-M.jpg?default=false'}
										onerror="this.onerror=null;this.src='http://covers.openlibrary.org/b/id/' +
									{book.covers} +
									'-M.jpg?default=false';"
										alt={book.title}
									/>
									<a data-sveltekit-preload-data href="/books/{book.bookId}">
										<!-- <button class="material-symbols-rounded">open_in_new</button> -->
									</a>
								</div>
							{:else}
								<span>No cover available</span>
								<!-- Show this if no cover was found from the API -->
							{/if}

							<div class="titleProgress">
								<a href="/books/{book.bookId}">
									<div class="title">{book.title}</div>
								</a>
								<div class="progress">
									<div>{book.category.name}</div>
									<div>{book.pages ? book.pages : '-'}/{book.tPages ? book.tPages : '?'}</div>
									<div>
										Scored
										<span>{book.rating !== null && book.rating !== '0' ? book.rating : '-'}</span>
									</div>
								</div>
							</div>
						</div>

						<div class="dateSpan">
							{formatDate(book.timestamp)}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	{#if fav.length > 0}
		<div class="favorites">
			<h1>Favorites</h1>
			<div class="bFav">
				{#each fav as book}
					<div class="favbookCard">
						<div class="favCover">
							{#if book.bookId}
								<a data-sveltekit-preload-data href="/books/{book.bookId}">
									<img
										src={'http://covers.openlibrary.org/b/id/' +
											book.covers +
											'-M.jpg?default=false'}
										alt={book.title}
									/>
								</a>
							{:else}
								<span>No cover available</span>
								<!-- Show this if no cover was found from the API -->
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
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

	/* Media queries */
	@media (max-width: 1024px) {
		.container {
			margin: 0 10rem;
		}

		.analytics {
			flex-direction: column;
			gap: 2rem;
		}

		.favorites {
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	}

	@media (max-width: 768px) {
		.container {
			margin: 0 5rem;
		}
	}

	@media (max-width: 480px) {
		.container {
			margin: 0 2rem;
		}
	}

	.material-icons {
		font-family: 'Material Icons';
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
		margin: 0 18%;
	}

	.analytics {
		display: flex;
		justify-content: space-between;
		padding: 2rem 0;
		gap: 2rem;
	}

	.activity {
		width: 40%;
	}

	.bio p {
		background-color: #fdfdfd;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 7px;
	}

	.analytics h1,
	.favorites h1,
	.statistics h1 {
		font-size: 16px;
	}

	.sContainer,
	.aContainer {
		margin: 1rem 0;
	}

	.sContainer {
		background-color: #f5f5f5;
		border-bottom-left-radius: 7px;
		border-bottom-right-radius: 7px;
	}
	.sOverview {
		display: flex;
		background-color: #fdfdfd;
		/* margin: 1rem 0; */
		border-top-left-radius: 7px;
		border-top-right-radius: 7px;
	}

	.sData {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem 2rem;
		font-weight: 600;
		text-align: center;
	}

	.sData div {
		padding: 0.2rem;
		display: flex;
	}

	.data {
		color: #3db4f2;
	}

	.sList {
		padding: 1.5rem 2rem;
		display: flex;
		flex-direction: column;
	}

	.listContainer {
		font-size: 15px;
		font-weight: 500;
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0rem;
		margin-right: 48%;
		align-items: end;
	}

	.listItem {
		display: flex;
	}

	.listItem {
		/* height: inherit; */
		display: flex;
		padding-right: 0.5rem;
		line-height: 20px;
		align-items: end;
	}

	.listItem a {
		transition: all 0.3s ease-in-out;
	}

	.listItem a:hover {
		color: #1faafa;
	}

	.listItem span {
		padding-right: 0.5rem;
	}

	.bookCard {
		will-change: transform; /* Hint to the browser about upcoming change */
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0;
		border-radius: 7px;
		background-color: #fafafa;
		padding-right: 1rem;
		flex-wrap: wrap;
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.bookCard:hover {
		transform: scale(1.02);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.titleCover {
		display: flex;
		align-items: center;
	}

	.imageContainer {
		position: relative;
		padding: 0;
		display: flex;
	}

	/* .material-symbols-rounded {
		position: absolute;
		top: 0;
		left: 0;
		border: none;
		height: 64px;
		width: 100%;
		font-size: 23px;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		opacity: 0;
		visibility: hidden; 
		transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
	} */

	/* .imageContainer:hover .material-symbols-rounded {
		opacity: 1;
		visibility: visible;
	} */

	.imageContainer img {
		will-change: transform; /* Hint to the browser about upcoming change */
		width: 67px;
		height: 90px;
		border-top-left-radius: 7px;
		border-bottom-left-radius: 7px;
	}

	.titleProgress {
		display: flex;
		width: 70%;
		flex-direction: column;
		justify-content: space-between;
		float: left;
		padding-left: 1rem;
		flex-wrap: wrap;
	}

	.title {
		color: #35539e;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.3s ease-in-out;
	}

	.title:hover {
		color: #1faafa;
	}

	.progress {
		display: flex;
		color: #858585;
		font-size: 12px;
		font-weight: 600;
		/* justify-content: space-between; */
	}

	.progress div {
		margin-right: 0.3rem;
		padding-right: 0.3rem;
	}

	.dateSpan {
		display: flex;
		color: #858585;
		font-size: 12px;
		font-weight: 700;
		align-items: center;
	}

	.bFav {
		background-color: #fdfdfd;
		display: flex;
		border-radius: 7px;
		padding: 0.5rem;
		margin-top: 1rem;
		margin-bottom: 3rem;
	}

	.favbookCard {
		padding: 1rem;
		height: 100%;
	}

	.favCover img {
		border-radius: 7px;
		width: 8rem;
		height: 12rem;
		object-fit: cover;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.favCover img:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
	}
</style>
