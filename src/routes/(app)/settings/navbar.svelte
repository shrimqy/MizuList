<script>
	import { page } from '$app/stores';
	console.log($page);
</script>

<div class="sidebar-container">
	<div class="sidebar">
		<h2>Settings</h2>
		<a href="/settings" class:selected={$page.url.pathname === '/settings'}> Profile </a>
		<a href="/settings/account" class:selected={$page.url.pathname === '/settings/account'}>
			Account
		</a>
	</div>
</div>

<style>
	h2 {
		font-size: 15px;
		font-weight: 400;
		color: #a99ba1;
	}

	.sidebar a.selected {
		color: #5c7298;
		font-weight: 600;
		background-color: #f7f8f9;
		border-radius: 3px;
	}

	.sidebar-container {
		display: flex;
		float: left;
		justify-content: right;
	}

	.sidebar {
		display: flex;

		flex-direction: column;
		height: 100%;
	}

	.sidebar a {
		display: flex;
		text-align: left;
		font-size: 15px;
		margin-top: 0.5rem;
		padding: 0.3rem 0.7rem;
		width: 9rem;
		color: #a99ba1;
		text-decoration: none;
	}

	.sidebar a:selected {
		background-color: #ddd;
	}
</style>
