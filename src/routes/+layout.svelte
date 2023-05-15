<script>
	import { page } from "$app/stores";
</script>


<nav data-sveltekit-preload-data class="navBar">
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

<style>
	*{
		margin: 0;
		padding: 0;
		color: #eeeeee;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}
	.navBar {
		margin: -8px -8px;
		background: #2B2D42;
		height: 70px;
		display: flex;
    	justify-content: center;
		align-items: center;
	}

	.navItems {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.navLinks {
    	color: #d3d5f3d8;
		padding: 0 2rem;
		transition: all 0.3s ease;
 	}

	.navbut button {
		width: 100%;
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

	.navbut button, a {
		color: #fff
	}

	.navbut button:hover {
		box-shadow: 0 2px 10px rgba(8,150,230,.6);
		color: #fff;
		transform: scale(1.03);
	}

	.navLinks:hover {
		color: #d3d5f3;
		transform: scale(1.03);
	}

</style>
<slot />
