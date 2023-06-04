<script>
	/** @type {import('./$types').PageData} */
	export let data;
	let { work, bookData, isbn, existingBook } = data;

	let recommendation = null;
	let spoilerWarning = false;
</script>

<div class="container">
	<h1>Review</h1>
	<form method="post">
		<div class="content-container">
			<div class="left-content">
				<div class="title">{existingBook.title}</div>
				<div class="review-text">
					<label>
						<span class="rheader">Review Content</span>
						<textarea rows="20" />
					</label>
				</div>
			</div>
			<div class="right-content">
				<div class="sbutton">
					<button type="submit"
						>Publish <span class="material-symbols-outlined"> send </span></button
					>
				</div>

				<div class="recommend">
					<p>Would you recommend this?</p>
					<label>
						<input type="radio" bind:group={recommendation} value="recommended" />
						Recommended
					</label>
					<label>
						<input type="radio" bind:group={recommendation} value="mixedFeelings" />
						Mixed Feelings
					</label>

					<label>
						<input type="radio" bind:group={recommendation} value="notRecommended" />
						Not Recommended
					</label>
				</div>
				<div class="spoiler">
					Spoiler Warning
					<div class="sChoice">
						<label>
							<input type="radio" bind:group={spoilerWarning} value="true" />Yes
						</label>
						<label>
							<input type="radio" bind:group={spoilerWarning} value="false" />No
						</label>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
	}

	:root {
		background-color: #fafafa;
	}

	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined';
		font-weight: 500;
	}

	.container {
		margin: 2rem 18%;
		max-width: 1200px;
	}

	.content-container {
		display: flex;
	}

	.left-content {
		flex: 1; /* Allow the left-content to grow */
		display: flex;
		flex-direction: column;
		width: 100%; /* Set width to 100% */
		max-width: 100%; /* Add a maximum width for the left-content */
		padding-right: 1rem;
		border-right: 2px solid rgb(250, 244, 244);
	}

	.right-content {
		display: flex;
		flex-direction: column;
		padding-left: 1rem;
		font-size: 14px;
		flex-shrink: 0; /* Prevent the right-content from shrinking */
	}

	.review-text {
		display: flex;
		flex-direction: column;
	}

	.rheader {
	}

	.container h1 {
		margin-bottom: 1rem;
		border-bottom: 1px solid rgb(250, 244, 244);
	}

	.title {
		margin-bottom: 1rem;
		font-weight: 600;
	}

	input[type='radio'] {
		margin: 0.7rem 0.7rem;
	}

	textarea {
		color: #5c7289;
		border: none;
		border-radius: 4px;
		padding: 1rem;
		background-color: #edf1f5;
		min-width: 100%; /* Expand the textarea to full width */
		max-width: 100%;
		box-sizing: border-box; /* Include padding and border in the width */
	}

	.recommend {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid rgb(250, 244, 244);
	}

	.spoiler {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		float: left;
	}

	.sbutton {
		display: flex;
		justify-content: center;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgb(250, 244, 244);
	}

	.sbutton button {
		width: 60%;
		padding: 0.25rem 1.4rem;
		background-color: #3577ff;
		display: flex;
		font-size: 12px;
		align-items: center;
		color: #fafafa;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.sbutton span {
		padding: 0 10%;
		font-size: 18px;
	}

	button:hover {
		background-color: #1e4ab8;
	}
</style>
