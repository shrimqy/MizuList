<script>
	import { fade } from 'svelte/transition';

	/** @type {import('./$types').PageData} */
	export let data;
	let { userData } = data;

	import Navbar from '../navbar.svelte';

	let showSave = false;
	function toggleSave() {
		showSave = true;
	}
</script>

<div class="container">
	<Navbar />
	<div class="content" in:fade={{ duration: 300 }}>
		<div class="listInput">
			<h3>User name</h3>

			<form method="post" action="?/updateUser">
				<input
					type="text"
					class="input"
					name="username"
					value={userData.username}
					on:focus={toggleSave}
				/>
				{#if showSave}
					<button formaction="?/updateUser" type="submit">Save</button>
				{/if}
			</form>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
	}

	:root {
		color: #5c728a;
		background-color: #edf1f5;
		overflow-y: scroll;
	}

	.container {
		display: flex;
		width: 60%;
		margin: 2rem auto;
		justify-content: center;
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		background-color: #fafafa;
		border-radius: 5px;
		padding: 1rem 1rem;
		margin: 0 1rem;
		min-width: 0;
		gap: 20px;
	}

	.listInput {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.listInput button {
		margin-top: 0.5rem;
		background-color: #3db4f2;
		outline: none;
		color: #fafafa;
		cursor: pointer;
		border: none;
		padding: 10px 13px;
		border-radius: 4px;
		transition: box-shadow 0.3s;
	}

	.input {
		border: none;
		outline: none;
		color: #4f6277;
		font-size: 15px;
		background-color: #f2f5f7;
		border-radius: 4px;
		padding: 7px 13px;
		min-width: 100%;
		box-sizing: border-box;
	}

	.listInput button:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>
