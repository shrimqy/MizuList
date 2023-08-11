<script>
	import { page, navigating } from '$app/stores';
	import { invalidateAll, afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	$: username = $page.data.user?.name;
	afterNavigate(() => {
		invalidateAll(); //rerun load functions
	});
	let showdrop = false;
	function Dropdown() {
		showdrop = true;
	}
	function Dropdownhide() {
		showdrop = false;
	}
</script>

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
					<!-- route protection  -->
					{#if !username}
						<a data-sveltekit-preload-code:viewport class="navLinks" href="/">Home</a>
						<a data-sveltekit-preload-data:viewport class="navLinks" href="/browse">Browse</a>
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
						<a class="navLinks" href="/browse">Browse</a>
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
							class="user-avatar"
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
</div>
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
		background: #2b2d4265;
		width: 100%;
		height: 3.5rem;
		display: flex;
		justify-content: center;
	}

	.navBar {
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
		will-change: transform; /* Hint to the browser about upcoming change */
		height: 40px;
		width: 40px;
		border-radius: 50%;
		object-fit: cover;
		cursor: pointer;
	}

	.profile {
		position: relative;
		padding: 1rem;
	}

	.dropdown {
		display: flex;
		flex-direction: column;
		align-items: start;
		position: absolute;
		top: 100%;
		width: 8rem;
		padding: 1rem;
		right: -50px;
		z-index: 999;
		cursor: pointer;
		background-color: #fbfbfb;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 7px;
	}

	.dropLink {
		display: flex;
		justify-content: start;
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
		font-weight: 700;
		background-color: #fbfbfb;
		color: #8092a0;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.dropLink:hover span,
	.dropLink:hover a,
	.dropLink:hover button {
		color: #6b7d8a;
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
		transform: scale(1.03);
		transform-origin: center;
	}

	.navLinks:hover {
		color: #d3d5f3;
		transform: scale(1.03);
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
</style>
