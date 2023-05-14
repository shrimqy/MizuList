<script>
	export let data;
	let book = data.book;
	console.log(book);
</script>

<div class="banner">

</div>
<div class="container">
	<div class="image-cover">
		<img
			src={'http://covers.openlibrary.org/b/id/' + book.covers[0] +'-M.jpg?default=false'}
			alt={book.title}
		/>
	</div>
	<div class="content">
		<div class="title">{book.title}</div>
		<div class="desc">{book.description?.value || book.description || ''}</div>
	</div>
</div>

<style>
	*{
		margin: -8px -8px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
	}

	.banner {
		background-color: #2B2D42;
		height: 100px;
	}

	.container {
		padding: 0rem 4rem;
		color: #EDF1F5;
		display: flex;
	}

	.image-cover img{
		margin: -10% 0px;
		height: 306px;
		width: 215px;
		border-style: none;
		border-radius: 2px;
		box-shadow: 2px 2px 7px rgba(0, 0, 0, 0.6);
	}

	.content {
		display: flex;
		flex-direction: column;
		margin: 35px 60px;
		color: #5E5E5E;
	}

	.title {
		font-size: 19px;
		color: #5E5E5E;
		font-weight: 600;
	}

	.desc {
		padding: 2rem 0rem;
	}

</style>