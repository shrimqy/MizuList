<script>
	import { page, navigating } from '$app/stores';
	$: username = $page.data.user?.name;
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	$: userData = $page.data.userData;

	let showdrop = false;
	let showrdrop = false;
	function Dropdown() {
		showdrop = true;
	}
	function Dropdownhide() {
		showdrop = false;
	}

	function rDropdown() {
		showrdrop = true;
	}
	function rDropdownhide() {
		showrdrop = false;
	}
</script>

{#if $page.url.pathname.startsWith(`/profile/`)}
	<div class="banner">
		<div class="header">
			{#if $navigating}
				<div class="load-bar">
					<div class="box" />
				</div>
			{/if}
			<div class="navBar">
				<div class="nav">
					<div class="logo">
						<img src="/logo_group.png" alt="" />
					</div>

					<nav class="navItems">
						{#if !username}
							<a data-sveltekit-preload-code:viewport class="navLinks" href="/">Home</a>
							<a data-sveltekit-preload-data class="navLinks" href="/browse">Browse</a>
							<div class="navLink-right">
								<a class="navLinks" href="/login">Login</a>
								<form class="navbut">
									<button><a href="/signup">Sign Up</a> </button>
								</form>
							</div>
						{:else}
							<a class="navLinks" href="/">Home</a>
							<a class="navLinks" href="/profile/{username}">Profile</a>
							<a class="navLinks" href="/profile/{username}/list">List</a>
							<div
								class="browse"
								on:mouseover={rDropdown}
								on:mouseleave={rDropdownhide}
								on:focus={rDropdown}
							>
								<a class="navLinks" href="/browse">Browse</a>
								{#if showrdrop}
									<div class="rdropdown" in:fade={{ duration: 200 }}>
										<div class="rdropLink">
											<span class="material-icons"> recommend </span><a href="/recommendations"
												>Recommendations</a
											>
										</div>
										<div class="rdropLink">
											<span class="material-icons"> star </span><a href="/reviews">Reviews</a>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</nav>
					{#if username}
						<div
							class="profile"
							on:mouseover={Dropdown}
							on:mouseleave={Dropdownhide}
							on:focus={Dropdown}
						>
							<img
								src={`/uploads/${$page.data.user?.id}.png`}
								alt="User Avatar"
								class="navavatar"
							/><span class="material-icons"> expand_more </span>
							{#if showdrop}
								<div class="dropdown" in:fade={{ duration: 200 }}>
									<div class="dropLink">
										<span class="material-icons"> person </span><a href="/profile/{username}"
											>Profile</a
										>
									</div>
									<div class="dropLink">
										<span class="material-icons"> settings </span><a href="/settings">Settings</a>
									</div>
									<form action="/logout" method="POST">
										<div class="dropLink">
											<span class="material-icons"> logout </span><button type="submit"
												>Log Out</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
		{#if !username}
			<div class="profile-header">
				{#if userData && userData?.avatar}
					<img src={`/uploads/${userData?.id}.png`} alt="User Avatar" class="user-avatar" />
				{/if}
				<span class="username">{userData?.username}</span>
			</div>
		{:else}
			<div class="profile-header">
				{#if userData?.avatar}
					<img src={`/uploads/${userData.id}.png`} alt="User Avatar" class="user-avatar" />
				{/if}
				<span class="username">{userData.username}</span>
			</div>
		{/if}
	</div>
{:else}
	<div class="header">
		{#if $navigating}
			<div class="load-bar">
				<div class="box" />
			</div>
		{/if}
		<div class="navBar-nologin">
			<div class="nav">
				<div class="logo">
					<img src="/Logo.png" alt="" />
				</div>

				<nav class="navItems">
					{#if !username}
						<a data-sveltekit-preload-code:viewport class="navLinks" href="/">Home</a>
						<a data-sveltekit-preload-data class="navLinks" href="/browse">Browse</a>
						<div class="navLink-right">
							<a class="navLinks" href="/login">Login</a>
							<form class="navbut">
								<button><a href="/signup">Sign Up</a> </button>
							</form>
						</div>
					{:else}
						<a data-sveltekit-preload-code:viewport class="navLinks" href="/">Home</a>
						<a data-sveltekit-preload-data class="navLinks" href="/browse">Browse</a>
						<a class="navLinks" href="/profile/{username}">Profile</a>
						<form class="navbut" action="/logout" method="POST">
							<button type="submit">Log Out</button>
						</form>
					{/if}
				</nav>
			</div>
		</div>
	</div>
	<div class="profile-header">
		{#if userData?.avatar}
			<img src={`/uploads/${userData?.username}.png`} alt="User Avatar" class="user-avatar" />
		{/if}
		<span class="username">{userData?.username}</span>
	</div>
{/if}
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
	<a
		href="/profile/{userData.username}/reviews"
		class:selected={$page.url.pathname.startsWith(`/profile/` + userData.username + `/reviews`)}
		>Reviews</a
	>

	{#if $page.url.pathname.startsWith(`/profile/` + username)}
		<!-- abstraction for settings page when visiting other's profile -->
		<a
			href="/profile/{userData.username}/history"
			class:selected={$page.url.pathname.startsWith(`/profile/` + userData.username + `/history`)}
			>History</a
		>
		<a href="/settings">Settings</a>
	{/if}
</nav>

<slot />

<style>
	* {
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}
	.header {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}

	.navBar {
		background: #2b2d4265;
		width: 100%;
		height: 3.5rem;
		display: flex;
		justify-content: center;
	}

	.navBar-nologin {
		background: #2b2d42;
		width: 100%;
		height: 3.5rem;
		display: flex;
		justify-content: center;
	}

	.nav {
		display: flex;
		align-items: center;
		height: 100%;
		width: 45%;
		max-width: 1050px;
	}
	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 55px;
		height: 55px;
	}

	.logo img {
		height: 65%;
	}

	.material-icons {
		font-family: 'Material Icons';
	}

	.profile {
		position: relative;
		padding: 1rem 0;
		display: flex;
		align-items: center;
		color: #5e6d79;
	}

	.navavatar {
		height: 40px;
		width: 40px;
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
	}

	.browse {
		position: relative;
		padding: 1.5rem 0;
		color: #5e6d79;
	}

	.dropdown {
		display: flex;
		flex-direction: column;
		align-items: start;
		position: absolute;
		top: 95%;
		width: 9rem;
		padding: 1rem;
		left: -100%;
		z-index: 999;
		cursor: pointer;
		background-color: #fbfbfb;
		box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
		border-radius: 7px;
	}

	/* Add the arrow shape to the dropdown */
	.dropdown::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 50%; /* Position it in the middle of the container */
		transform: translateX(-50%); /* Center the arrow horizontally */
		border-width: 7px;
		border-style: solid;
		border-color: transparent transparent #fbfbfb transparent;
	}

	.dropLink {
		display: flex;
		align-items: center;
	}

	.dropdown span {
		font-size: 17px;
		color: #5e6d79;
		font-weight: 600;
		transition: all 0.5s ease-in-out;
	}

	.dropdown a,
	.dropdown button {
		border: none;
		font-size: 15px;
		padding: 7px 15px;
		font-weight: 600;
		background-color: #fbfbfb;
		color: #5e6d79;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.dropLink:hover span,
	.dropLink:hover a,
	.dropLink:hover button {
		color: #343c42;
	}

	.rdropdown {
		display: flex;
		flex-direction: column;
		align-items: start;
		position: absolute;
		top: 95%;
		width: 10rem;
		padding: 0.8rem;
		left: 0;
		z-index: 999;
		cursor: pointer;
		background-color: #fbfbfb;
		box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
		border-radius: 7px;
	}

	.rdropdown::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 25%; /* Position it in the middle of the container */
		transform: translateX(-50%); /* Center the arrow horizontally */
		border-width: 7px;
		border-style: solid;
		border-color: transparent transparent #fbfbfb transparent;
	}

	.rdropLink {
		display: flex;
		justify-content: start;
		align-items: center;
	}

	.rdropLink span {
		font-size: 17px;
		color: #8092a0;
		font-weight: 600;
		transition: all 0.5s ease-in-out;
	}

	.rdropLink a {
		border: none;
		font-size: 14px;
		padding: 10px 10px;
		font-weight: 500;
		color: #8092a0;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.rdropLink:hover span,
	.rdropLink:hover a {
		color: #5e6d79;
	}

	.navItems {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.navBar a {
		color: #d3d5f3d8;
		font-weight: 600;
		font-size: 14px;
		padding: 0rem 1.3rem;
		transition: all 0.3s ease;
	}

	.navLink-right {
		display: flex;
		align-items: center;
		padding: 0.5rem 0rem;
		padding-right: 2rem;
	}

	.navbut button,
	.navbut a {
		font-size: 16px;
		font-weight: 600;
		border: 1px;
		border-radius: 6px;
		background-color: #3577ff;
		color: #fff;
		cursor: pointer;
		padding: 10px 10px;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.navbut button {
		font-size: 16px;
		font-weight: 600;
		border: 1px;
		border-radius: 6px;
		background-color: #3577ff;
		color: #fff;
		cursor: pointer;
		padding: 10px 10px;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.navbut button,
	.navbut a {
		color: #fff;
	}

	.navbut button:hover {
		box-shadow: 0 2px 10px rgba(8, 150, 230, 0.6);
		color: #fff;
		transform: scale(1.03);
		transform-origin: center;
	}

	.navLinks:hover {
		color: #d3d5f3;
		transform: scale(1.03);
	}

	/* Responsive Styles */
	@media screen and (max-width: 768px) {
		.navItems {
			flex-direction: column;
		}

		.navLinks,
		.navbut button {
			padding: 0.5rem;
		}

		.navbut button {
			width: 100%;
		}
	}

	.load-bar {
		position: fixed;
		z-index: 1900;
		width: 100%;
		height: 2px;
		overflow: hidden;
	}

	.box {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background-color: #3577ff;
		animation: loading 2s ease-in-out infinite alternate;
	}

	@keyframes loading {
		0% {
			transform: translateX(-85%);
		}
		100% {
			transform: translateX(185%);
		}
	}

	.banner {
		width: 100%;
		background: #2b2d42;
		height: 300px;
		display: flex;
		flex-direction: column;
		box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.1);
		background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
			url(https://s4.anilist.co/file/anilistcdn/user/banner/b5509366-eoLTht6H4nXH.jpg);
		background-size: cover; /* Adjusts the size of the background image to cover the entire container */
		background-position: center; /* Centers the background image within the container */
		background-repeat: no-repeat; /* Prevents the background image from repeating */
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

	.profileNav a {
		color: #768ca3;
		font-weight: 600;
		font-size: 14px;
		padding: 1rem 2rem; /* Adjusted */
		transition: all 0.3s ease;
	}

	.profileNav a:hover {
		color: #1faafa;
	}

	.profileNav a.selected {
		color: #1faafa; /* Change this to the desired color for the active page */
	}

	/* Responsive Styles */
	@media screen and (max-width: 768px) {
		.profileNav a {
			padding: 0.5rem 1rem; /* Adjusted */
		}
	}
</style>
