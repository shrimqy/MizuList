<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="container">
	<div class="box">
		<h3>Login</h3>
		<form class="signup">
			<input type="text" placeholder="Username" required />
			<input type="password" placeholder="Password" required />
			<button>Login</button>
		</form>
		<p>Don't have an account? <a href="/signup">Register</a></p>
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

	.signup {
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
		width: 5rem;
		height: 2.7rem;
		font-size: 16px;
		font-weight: 600;
		background-color: #3db4f2;
		color: white;
		cursor: pointer;
		border-radius: 7px;
	}

	.box p {
		font-size: 14px;
	}

	a {
		color: #0077cc;
		text-decoration: none;
	}
</style>
