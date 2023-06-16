<script>
	export let data;
	let { userData } = data;
	import { page } from '$app/stores';
</script>

<div class="banner">
	<div class="profile-header">
		{#if userData && userData.avatar}
			<img src={`/uploads/${userData.username}.png`} alt="User Avatar" class="user-avatar" />
		{/if}
		<span class="username">{userData.username}</span>
	</div>
</div>

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

	.banner {
		width: 100%;
		background: #2b2d42;
		height: 220px;
		box-shadow: 0px 6px 6px rgba(255, 255, 255, 0.6); /* Adjusted */
	}

	.profile-header {
		height: 100%;
		display: flex;
		align-items: flex-end; /* Adjusted */
		justify-content: start; /* Adjusted */
		margin: 0 18%; /* Adjusted */
	}

	.username {
		padding: 1rem;
		font-size: 22px;
		font-weight: 600;
		color: #e6ecf2;
	}

	.user-avatar {
		width: 158px;
		height: 158px;
		object-fit: cover;
		border-top-left-radius: 7px;
		border-top-right-radius: 7px;
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
		.profile-header {
			flex-direction: column;
			align-items: center;
		}

		.username {
			padding: 0.5rem; /* Adjusted */
			text-align: center; /* Added */
		}

		.user-avatar {
			width: 120px; /* Adjusted */
			height: 120px; /* Adjusted */
			margin-bottom: 0.5rem; /* Added */
		}

		nav a {
			padding: 0.5rem 1rem; /* Adjusted */
		}
	}
</style>
