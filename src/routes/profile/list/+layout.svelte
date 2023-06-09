<script>
	/** @type {import('./$types').LayoutData} */
	import { page } from '$app/stores';
	// export let data;
</script>

<title>{$page.data.user.name}'s Book List</title>
<nav class="listNav">
	<a href="/profile/list/All" class:selected={$page.url.pathname === '/profile/list/All'}>All</a>
	<a href="/profile/list" class:selected={$page.url.pathname === '/profile/list'}>Reading</a>
	<a href="/profile/list/Planning" class:selected={$page.url.pathname === '/profile/list/Planning'}
		>Plan to Read</a
	>
	<a href="/profile/list/Paused" class:selected={$page.url.pathname === '/profile/list/Paused'}
		>Paused</a
	>
	<a href="/profile/list/Dropped" class:selected={$page.url.pathname === '/profile/list/Dropped'}
		>Dropped</a
	>
	<a
		href="/profile/list/Completed"
		class:selected={$page.url.pathname === '/profile/list/Completed'}>Completed</a
	>
</nav>

<slot />

<style>
	* {
		margin: 0;
		padding: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}
	.listNav {
		display: flex;
		align-items: center;
		padding: 0 20rem;
		justify-content: space-around;

		background: #fafafa;
	}

	nav a {
		color: #5c7289;
		font-weight: 600;
		font-size: 13px;
		padding: 1rem 0rem;
		transition: all 0.3s ease-in-out;
	}

	nav a:hover {
		color: #1faafa;
	}

	nav a.selected {
		color: #1faafa; /* Change this to the desired color for the active page */
	}
</style>
