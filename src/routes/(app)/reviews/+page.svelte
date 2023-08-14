<script>
	/** @type {import('./$types').PageData} */
	import { fade } from 'svelte/transition';
	import { formatDate, filterTags } from '$lib/utils';
	export let data;
	let { reviews, work } = data;

	// Sort reviews by newest first
	reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

	function toggleForm() {
		showForm = !showForm;
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
</script>

<div class="container" in:fade={{ duration: 300 }}>
	<div class="review">
		<div class="review-head">
			<h1 style="color: #61778f">Recent Reviews</h1>
		</div>

		{#each reviews as review, reviewIndex}
			<div class="review-container">
				<img
					src={'https://covers.openlibrary.org/b/olid/' + review.covers + '-M.jpg?default=false'}
					onerror="this.onerror=null;this.src='http://covers.openlibrary.org/b/id/' +
											{review.covers} +
											'-M.jpg?default=false';"
					alt={review.title}
					class="avatar"
				/>
				<div class="review-body">
					<div class="review-header">
						<h3 class="user-name">{review.title}</h3>
						<span class="review-date">{formatDate(review.date, 'reviewDate')}</span>
					</div>
					<div class="user">
						<img src={`/uploads/${review.user.id}.png`} alt="User Avatar" class="user-avatar" />
						<h3 class="user-name">{review.user.username}</h3>
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
						<div class="review-rating">Rating: {review.rating}</div>
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

<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
	}

	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
	}

	.material-icons {
		font-family: 'Material Icons';
	}

	.material-icons-outlined {
		font-family: 'Material Icons';
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

	/* .material-icons {
		font-family: 'Material Icons';
	} */

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
		margin: 1rem 18%;
	}

	.review-head {
		display: flex;
		justify-content: space-between;
		align-items: end;
		margin-bottom: 1rem;
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

	.avatar {
		height: 130px;
		width: 100px;
		border-radius: 3px;
		margin-right: 2rem;
		object-fit: cover;
	}

	.user {
		display: flex;
		align-items: center;
		margin: 1rem 0;
	}

	.user-avatar {
		height: 54px;
		width: 54px;
		border-radius: 50%;
		margin-right: 1rem;
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

	.review-tags {
		display: flex;
		gap: 2%;
		font-size: 13px;
		align-items: center;
		margin-bottom: 1rem;
	}

	.rtag {
		display: flex;
		border-radius: 5px;
		padding: 0.2rem 0.5rem;
	}
</style>
