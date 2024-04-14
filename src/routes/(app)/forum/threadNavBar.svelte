<script>
    /** @type {import('./$types').LayoutData} */
    import { page } from '$app/stores';
    export let foo;
	const feed = [ 'Ov']
</script>

<div class="sidebar-container">
	<div class="sidebar">
        <h3>Categories</h3>
		<a href="/forum" class:selected={$page.url.pathname === '/forum'}>All</a>
		{#each foo as item}
			<a href="" class:selected={$page.url.pathname === '/forum/' + item.name}>{item.name}</a>
		{/each}
	</div>
</div>

<style>

	* {
		font-family: 'Overpass', sans-serif;
	}

	:root {
		color: #5c728a;
		background-color: #edf1f5;	
		overflow-y: scroll;
	}

	h3 {
		font-size: 15px;
		font-weight: 400;
		color: #a99ba1;
	}

	.sidebar a.selected {
		color: #5c7298;
		font-weight: 600;
		background-color: #f7f8f9;
		border-radius: 3px;
	}

	.sidebar-container {
		display: flex;
		float: left;
		justify-content: right;
		margin: 2rem 0;
		margin-right: 2rem;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.sidebar a {
		display: flex;
		border: none;
		background-color: transparent;
		cursor: pointer;
		text-align: left;
		font-size: 15px;
		margin-top: 0.5rem;
		padding: 0.3rem 0.7rem;
		width: 9rem;
		color: #a99ba1;
		text-decoration: none;
	}

	.sidebar a:selected {
		background-color: #ddd;
	}
</style>
<slot />