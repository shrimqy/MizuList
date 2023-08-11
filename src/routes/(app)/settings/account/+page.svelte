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
	let showPassword = false;

	let newPassword = '';
	let confirmPassword = '';

	function togglePassword() {
		showPassword = newPassword === confirmPassword && newPassword.length > 0;
	}
</script>

<div class="container">
	<Navbar />
	<div class="content" in:fade={{ duration: 300 }}>
		<div class="listInput">
			<form method="post" action="?/updateUsername">
				<div class="section">
					<h3>User Name</h3>

					<input
						type="text"
						class="input"
						name="username"
						value={userData.username}
						on:input={toggleSave}
					/>
					{#if showSave}
						<button formaction="?/updateUsername" type="submit">Save Username</button>
					{/if}
				</div>
			</form>
			<form method="post" action="?/updatePassword">
				<div class="section">
					<h3>Change Password</h3>
					<input
						type="password"
						class="input"
						placeholder="New Password"
						bind:value={newPassword}
						on:input={togglePassword}
					/>
					<input
						type="password"
						class="input"
						placeholder="Confirm Password"
						name="password"
						bind:value={confirmPassword}
						on:input={togglePassword}
					/>
					{#if showPassword}
						<button formaction="?/updatePassword" type="submit">Save Password</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	* {
		font-family: 'Overpass', sans-serif;
	}

	h3 {
		color: #5c728a;
		font-size: 15px;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto Bold, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-weight: 600;
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
		gap: 20px;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	button {
		width: 120px;
		background-color: #3db4f2;
		outline: none;
		color: #fafafa;
		cursor: pointer;
		padding: 7px;
		border: none;
		border-radius: 4px;
		transition: box-shadow 0.3s;
	}

	.input {
		border: none;
		outline: none;
		color: #627891;
		font-size: 15px;
		background-color: #f2f5f7;
		border-radius: 4px;
		padding: 7px 13px;
		min-width: 100%;
		box-sizing: border-box;
	}

	input::placeholder {
		color: #9eb1c9;
	}

	button:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>
