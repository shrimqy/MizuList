<script>
	import { page } from '$app/stores';
</script>

<div class="banner">
	<div class="profile-header">
		<img
			src="https://cdn.myanimelist.net/s/common/userimages/ccd5d0a5-a3f5-4026-8c7d-d863a04f689a_225w?s=a5ee9982a49a58929103f3961d051a53"
			alt="User Avatar"
			class="user-avatar"
		/>
		<span class="username">{$page.data.user.name}</span>
	</div>
</div>

<nav class="profileNav">
	<a href="/profile" class:selected={$page.url.pathname === '/profile'}>Overview</a>
	<a href="/profile/list" class:selected={$page.url.pathname === '/profile/list'}>List</a>
	<a href="/profile/history" class:selected={$page.url.pathname === '/profile/history'}>History</a>
</nav>

<slot />

<style>
	* {
		margin: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}

	.banner {
		width: 100%;
		background: #2b2d42;
		height: 220px;
	}

	.profile-header {
		height: 100%;
		display: flex;
		align-items: end;
		margin: 0 20rem;
	}

	.username {
		padding: 1rem;
		font-size: 22px;
		font-weight: 600;
		color: #e6ecf2;
	}

	.user-avatar {
		width: 12%;
		/* border-radius: 7px; */

		/* box-shadow: 0px 1px 10px rgba(255, 255, 255, 0.1); */
		border-top-left-radius: 7px;
		border-top-right-radius: 7px;
	}

	.profileNav {
		background-color: #2b2d42;
		display: flex;
		align-items: center;
		justify-content: center;
		/* border-top: 1px solid #ccc; */
		box-shadow: 5px 5px 5px rgba(247, 241, 241, 1);
	}

	nav a {
		color: #768ca3;
		font-weight: 600;
		font-size: 14px;
		padding: 1rem 4rem;
		transition: all 0.3s ease;
	}

	nav a:hover {
		color: #1faafa;
	}

	nav a.selected {
		color: #1faafa; /* Change this to the desired color for the active page */
	}
</style>
