<script>
    /** @type {import('./$types').PageData} */
	import { fade, fly, scale } from 'svelte/transition'; //for transitions
    export let data;

    console.log(data.series);
    let series = data.series
</script>

<title>{series.name}</title>

<div class="container">
	<span class="series-title">{series.name} Series</span>
	<div class="book-container">
		{#each series.SeriesBook as item,i}
			<a
				data-sveltekit-preload-data
				href="/books/{item.book.id}"
			>
				<div class="bookCard">
					<div class="bookCover" in:scale={{ duration: 300 }}>
						{#if item.book.coverUrl}
							<img
								src={item.book?.coverUrl}
								alt={item.book?.englishTitle}
							/>
						{:else}
							<span>No cover available</span> 
						{/if}
					</div>
					<div class="book-details">
						<div class="title">#{item.order} {item.book.englishTitle}</div>
						<div class="description">{item.book.Description.slice(0, 200)} ...</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
	
</div>

<style>
    * {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
        text-decoration: none;
	}

	:root {
		background-color: #edf1f5;
	}

	.container {
		padding: 2rem;
		margin: 0 auto; 
	}
	@media (min-width: 1540px) {
		.container {
			max-width: 1520px;
			padding-left: 100px;
			padding-right: 100px;
		}
	}

	@media (min-width: 1040px) and (max-width: 1540px) {
		.container {
			max-width: 90%;
		}
	}

	.series-title {
		font-family: Copernicus, Cochin, Georgia, Times, 'Times New Roman', serif;
		font-size: 34px;
		font-weight: 700;
		color: #5e5e5e;
	}

	.book-container {
		padding: 2rem 0rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
		color: #647380;
		gap: 20px;
	}

	.bookCard {
		background-color: #fbfbfb;
		color: #647380;
		display: flex;
		transition: all 0.3s ease-in;
		border-radius: 6px;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
	}

	.book-details {
		margin-left: 1rem;
	}

	.title {
		font-style: oblique;
		font-weight: 500;
		font-size: 18px;
	}

	.description {
		font-size: 12px;
	}

	.bookCover {
		background-color: rgb(202, 202, 202);
		border-radius: 6px;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: #fff;
	}

	img {
		width: 130px;
		height: 200px;
		border-style: none;
		object-fit: cover;
		border-radius: 6px;
	}

	.title {
		padding: 10px 0;
		overflow-wrap: break-word;
		transition: all 0.5s ease-in-out;
	}

	.bookCard:hover .title {
		color: #1faafa;
		
	}

	.bookCard:hover {
		box-shadow: 2px 2px 9px rgba(0, 0, 0, 0.4);
	}
</style>