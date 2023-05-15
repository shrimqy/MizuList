<script>
	/** @type {import('./$types').PageData} */
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="container">
	<div class="box">
		<h3>Login</h3>

		<form method="POST" action="?/login" class="login">
			<input id="username" name="username" type="text" placeholder="Username" required />
			<!-- <input name="email" type="email" placeholder="Email" required> -->
			<input id="password" name="password" type="password" placeholder="Password" required />
			<button type="submit">Login</button>

			{#if form?.user}
				<!-- if the same username is found to be in the database already -->
				<p class="error">Username is taken.</p>
			{/if}
		</form>
		<p>Already have an account? <a href="/login">Log in</a></p>
	</div>
</div>

<style>
	:root {
		font-family: 'Poppins', sans-serif;
		background-color: #edf1f5;
	}

	.container {
		height: 90vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.box {
		height: 67vh;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 0px 50px;
		background-color: #fafafa;
		border: 1px;
		border-radius: 4px;
		box-shadow: 0px 0px 5px rgba(37, 34, 63, 0.01);
	}

	.box h3 {
		font-size: 20px;
		padding-top: 30px;
		margin-bottom: 0px;
		color: #5c728a;
	}

	.login {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 300px;
	}

	input,
	button {
		margin: 10px 0;
		padding: 13px 20px;
		border: 1px;
		background-color: #f1f4f7;
		border-radius: 5px;
		width: 100%;
		box-sizing: border-box;
	}

	input,
	button:focus {
		outline: none;
	}

	button {
		width: 100px;
		font-size: 16px;
		font-weight: 600;
		background-color: #3db4f2;
		color: white;
		cursor: pointer;
	}

	.box p {
		font-size: 14px;
	}

	a {
		color: #0077cc;
		text-decoration: none;
	}
</style>
