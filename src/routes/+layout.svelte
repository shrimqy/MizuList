<script>
	import { page, navigating } from '$app/stores';

	export let data;
	let { userData } = data;
	let username = $page.data.userData?.username;
</script>

{#if $page.url.pathname.startsWith(`/profile/` + userData.username)}
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
						<img src="/Logo.png" alt="" />
					</div>

					<nav class="navItems">
						{#if !username}
							<a data-sveltekit-preload-data class="navLinks" href="/Browse">Browse</a>
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
			{#if userData && userData?.avatar}
				<img src={`/uploads/${userData?.username}.png`} alt="User Avatar" class="user-avatar" />
			{/if}
			<span class="username">{userData?.username}</span>
		</div>
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
						<a data-sveltekit-preload-data class="navLinks" href="/">Search</a>
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
	<!-- <div class="profile-header">
		{#if userData && userData?.avatar}
			<img src={`/uploads/${userData?.username}.png`} alt="User Avatar" class="user-avatar" />
		{/if}
		<span class="username">{userData?.username}</span>
	</div> -->
{/if}

<slot />

<style>
	* {
		margin: 0;
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
		height: 100%;
		width: 100%;
	}

	.navItems {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.navLinks {
		color: #d3d5f3d8;

		padding: 0.5rem 1rem;
	}

	.navLink-right {
		display: flex;
		align-items: center;
		padding: 0.5rem 0rem;
		padding-right: 2rem;
	}

	.navbut button {
		font-size: 16px;
		font-weight: 600;
		border: 1px;
		border-radius: 6px;
		background-color: #3577ff;
		color: #fff;
		cursor: pointer;
		padding: 10px 12px;
		text-decoration: none;
		transition: all 0.3s ease-in-out;
	}

	.navbut button,
	a {
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
</style>
