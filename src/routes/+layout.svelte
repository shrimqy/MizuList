<script>
	import { page, navigating } from '$app/stores';
</script>

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
				{#if !$page.data.user}
					<a data-sveltekit-preload-data class="navLinks" href="/">Search</a>
					<div class="navLink-right">
						<a class="navLinks" href="/login">Login</a>
						<form class="navbut">
							<button><a href="/signup">Sign Up</a> </button>
						</form>
					</div>
				{/if}

				{#if $page.data.user}
					<a data-sveltekit-preload-code:viewport class="navLinks" href="/">Home</a>
					<a class="navLinks" href="/profile">Profile</a>
					<form class="navbut" action="/logout" method="POST">
						<button type="submit">Log Out</button>
					</form>
				{/if}
			</nav>
		</div>
	</div>
</div>

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
		background: #2b2d42;
		width: 100%;
		height: 100%;
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
		transition: all 0.3s ease;
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
		transition: all 0.3s ease;
		text-decoration: none;
	}

	.navbut button,
	a {
		color: #fff;
	}

	.navbut button:hover {
		box-shadow: 0 2px 10px rgba(8, 150, 230, 0.6);
		color: #fff;
		transform: scale(1.03);
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
</style>
