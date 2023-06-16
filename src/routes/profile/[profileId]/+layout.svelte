<script>
	export let data;
	let { userData } = data;
	let username = $page.data.userData?.username;
	console.log(username);
	import { page, navigating } from '$app/stores';
</script>

<nav class="profileNav">
	<a
		href="/profile/{userData.username}"
		class:selected={$page.url.pathname === `/profile/` + userData.username}>Overview</a
	>
	<a
		href="/profile/{userData.username}/list"
		class:selected={$page.url.pathname.startsWith(`/profile/` + userData.username + `/list`)}
		>List</a
	>
	<a href="/settings">Settings</a>
</nav>

<slot />

<style>
	* {
		margin: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}

	.profileNav {
		background-color: #2b2d42;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1); /* Adjusted */
	}

	nav a {
		color: #768ca3;
		font-weight: 600;
		font-size: 14px;
		padding: 1rem 2rem; /* Adjusted */
		transition: all 0.3s ease;
	}

	nav a:hover {
		color: #1faafa;
	}

	nav a.selected {
		color: #1faafa; /* Change this to the desired color for the active page */
	}

	/* Responsive Styles */
	@media screen and (max-width: 768px) {
		nav a {
			padding: 0.5rem 1rem; /* Adjusted */
		}
	}
</style>
