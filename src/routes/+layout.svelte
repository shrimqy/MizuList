<nav class="navBar">
	<div class="navItems">
		<a href="/">Home</a>
		<a href="/login">Login</a>
		<a href="/profile">Profile</a>
	</div>
</nav>

<style>
	*{
		margin: 0;
		padding: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}
	.navBar {
		margin: -8px -8px;
		background: #2B2D42;
		height: 70px;
		display: flex;
    	justify-content: center;
		align-items: center
	}

	.navItems a {
    	color: #eeeeee;
 	}
</style>
<slot />
