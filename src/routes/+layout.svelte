<script>
	import { page } from '$app/stores';
</script>

<nav class="navBar">
	<div class="navItems">
		<a class="navLinks" href="/">Home</a>

		{#if !$page.data.user}
			<a class="navLinks" href="/login">Login</a>
			<form class="navbut">
				<button><a href="/signup">Sign Up</a> </button>
			</form>
		{/if}

		{#if $page.data.user}
			<a class="navLinks" href="/profile">Profile</a>
			<form class="navbut" action="/logout" method="POST">
				<button type="submit">Log Out</button>
			</form>
		{/if}
	</div>
</nav>
<slot />

<style>
	* {
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}

	.navBar {
		width: 100%;
		background: #2b2d42;
		height: 70px;
		display: flex;
		justify-content: center;
	}

	.navItems {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap; /* Added */
	}

	.navLinks {
		color: #d3d5f3d8;
		padding: 0.5rem 1rem; /* Adjusted */
		transition: all 0.3s ease;
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
			padding: 0.5rem; /* Adjusted */
		}

		.navbut button {
			width: 100%;
		}
	}
</style>
