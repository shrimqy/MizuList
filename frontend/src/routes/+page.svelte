<script>
	export let data;
	let bookTitle = data.props.bookTitle;
</script>
<div class="container">
	<h1>Trending Weekly Now</h1>
	<div class="books">
		{#each bookTitle as book}
			<div class="bookCard">
				<img
					src={'http://covers.openlibrary.org/b/olid/' + book.cover_edition_key +'-M.jpg?default=false'}
					alt={book.title}
				/>
				<div class="title">{book.title}</div>
			</div>
		{/each}
	</div>
</div>


<style>
	*{
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
		
	}
	.container {
		color: #EDF1F5;
		padding: 7rem 18rem;
	}

	h1 {
		font-size: 22px;
		color: #5E5E5E;
		font-weight: 600;
	}

	.books {
		padding: 1rem 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		color: #647380;
	}

	.bookCard {
		width: 21vb;
		font-size: 15px;
		color: #647380;
		font-weight: 600;
		display: flex;
		flex-direction: column;
	}

	img {
		height: 30vh;
		width: 19.5vh;
		border-style: none;
		border-radius: 6px;
		object-fit: cover;
		box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
	}

	.title {
	padding: 10px 0;
	overflow-wrap: break-word;
	}
</style>
