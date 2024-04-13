<script>
	import { page, navigating } from '$app/stores';
	import { invalidateAll, afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	$: homeusername = $page.data.user?.name;
	$: username = $page.data?.userData?.username;
	$: userData = $page.data?.userData;

	let userFollow = $page.data?.userFollow?.following;
	$: profilePage = $page.url.pathname.startsWith(`/profile/`)

	afterNavigate(() => {
		invalidateAll(); //rerun load functions
	});
	
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


<div class="header">
	{#if $navigating}
		<div class="load-bar">
			<div class="box" />
		</div>
	{/if}
	<div class="navBar {$page.url.pathname.startsWith(`/profile/`) ? 'profile-page' : ''}" >
		<div class="nav">
			<div class="logo">
				<img src="/logo_group.png" alt="" />
			</div>

			<nav class="navItems">
				<!-- route protection  -->
				{#if !homeusername}
					<a class="navLinks" href="/">Home</a>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
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
					<a class="navLinks" href="/browse">Forum</a>
					<div class="navLink-right">
						<a class="navLinks" href="/login">Login</a>
						<form class="navbut">
							<button><a href="/signup">Sign Up</a> </button>
						</form>
					</div>
				{:else}
					<a class="navLinks" href="/">Home</a>
					<a class="navLinks" href="/profile/{homeusername}">Profile</a>
					<a class="navLinks" href="/profile/{homeusername}/list">List</a>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
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
					<a class="navLinks" href="/browse">Forum</a>
				{/if}
			</nav>
			{#if homeusername}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="profile"
					on:mouseover={Dropdown}
					on:mouseleave={Dropdownhide}
					on:focus={Dropdown}
				>
					<img
						src={`/uploads/userAvatars/${$page.data.user?.id}.png`}
						alt="User Avatar"
						class="user-avatar"
					/><span class="material-icons"> expand_more </span>
					{#if showdrop}
						<div class="dropdown" in:fade={{ duration: 200 }}>
							<div class="dropLink">
								<span class="material-icons"> person </span><a href="/profile/{homeusername}"
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

{#if profilePage}
	<div class="banner">
		<div class="profile-header">
			<div class="user">
				{#if userData?.avatar}
					<img src={`/uploads/userAvatars/${userData.id}.png`} alt="User Avatar" class="userAvatar-profileNav" />
				{/if}
				<span class="username">{userData?.username}</span>
			</div>
			{#if homeusername !== username}
				 {#if !userFollow[0]?.username}
					<form method="post" action="?/SocialAction">
						<button class="socialAction" formaction="?/SocialAction">Follow</button>
					</form>
				{:else}
					<form method="post" action="?/SocialAction">
						<button class="socialAction" formaction="?/SocialAction">UnFollow</button>
					</form>
				{/if}
			{/if}
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
{/if}


<slot />


<style>
	* {
		margin: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}

	.material-icons {
		font-family: 'Material Icons';
	}

	.header {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
	}

	.navBar {
		will-change: transform; /* Hint to the browser about upcoming change */
		background: #2b2d42;
		width: 100%;
		height: 3.5rem;
		display: flex;
		justify-content: center;
	}

	.navBar.profile-page {
		background: #2b2d4265;
		width: 100%;
		height: 3.5rem;
		display: flex;
		justify-content: center;
	}

	.nav {
		display: flex;
		align-items: center;
		height: 100%;
		width: 44.5%;
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

	.navItems {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.navLink-right {
		display: flex;
		align-items: center;
		padding: 0.5rem 0rem;
		padding-right: 2rem;
	}

	.navLinks {
		color: #d3d5f3d8;
		font-weight: 600;
		font-size: 14px;
		padding: 0rem 1.3rem;
		transition: all 0.3s ease;
	}

	.user-avatar {
		height: 40px;
		width: 40px;
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
	}

	.profile {
		position: relative;
		padding: 1rem 0;
	}

	.browse {
		position: relative;
		padding: 1.5rem 0;
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
		color: #8092a0;
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
		color: #8092a0;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.dropLink:hover span,
	.dropLink:hover a,
	.dropLink:hover button {
		color: #5e6d79;
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

	.rdropdown span {
		font-size: 17px;
		color: #8092a0;
		font-weight: 600;
		transition: all 0.5s ease-in-out;
	}

	.rdropdown a {
		border: none;
		font-size: 14px;
		padding: 10px 10px;
		font-weight: 500;
		background-color: #fbfbfb;
		color: #8092a0;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.rdropLink:hover span,
	.rdropLink:hover a {
		color: #5e6d79;
	}

	.navbut button,
	.navbut a {
		color: #fff;
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

	.navbut button:hover {
		box-shadow: 0 2px 10px rgba(8, 150, 230, 0.6);
		color: #fff;
		/* transform: scale(1.03); */
		transform-origin: center;
	}

	.navLinks:hover {
		color: #daddff;
		/* transform: scale(1.03); */
	}

	.profile {
		display: flex;
		align-items: center;
		float: right;
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

	/* Responsive Styles */
	@media screen and (max-width: 768px) {
		nav a {
			padding: 0.5rem 1rem; /* Adjusted */
		}
	}

	.header {
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 999;
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


	.navItems {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
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
		/* transform: scale(1.03); */
		transform-origin: center;
	}

	.navLinks:hover {
		color: #d3d5f3;
		/* transform: scale(1.03); */
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
		box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.1);
		background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
			url(https://s4.anilist.co/file/anilistcdn/user/banner/b5509366-eoLTht6H4nXH.jpg);
		background-size: cover; 
		background-position: center; 
		background-repeat: no-repeat;
		margin-top: -3.5rem;
		position: relative;
	}

	.profile-header {
		height: 100%;
		display: flex;
		align-items: flex-end; 
		justify-content: space-between; 
		margin: 0 18%; 
	}
	
	.socialAction {
		font-size: 16px;
		font-weight: 600;
		border: 1px;
		margin: 1rem 0;
		padding: 6px 15px;
		border-radius: 6px;
		background-color: #3066d3;
		color: #fff;
		cursor: pointer;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.username {
		padding: 0 1rem;
		font-size: 22px;
		font-weight: 600;
		color: #e6ecf2;
	}

	.user { 
		display: flex;
    	align-items: flex-end;
	}

	.userAvatar-profileNav {	
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
		box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.1); 
		z-index: 999;
	}

	.profileNav a {
		color: #768ca3;
		font-weight: 600;
		font-size: 14px;
		padding: 1rem 2rem;
		transition: all 0.3s ease;
		
	}

	.profileNav a:hover {
		color: #1faafa;
	}

	.profileNav a.selected {
		color: #1faafa; 
	}

	/* Responsive Styles */
	@media screen and (max-width: 768px) {
		.profileNav a {
			padding: 0.5rem 1rem; 
		}
	}
</style>
