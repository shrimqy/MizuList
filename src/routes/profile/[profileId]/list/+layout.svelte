<script>
	/** @type {import('./$types').LayoutData} */
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	export let data;
	let { userData } = data;

	let username = $page.data.userData?.username;

	console.log($page.data.userData?.username);
	let showForm = false;
	function toggleForm() {
		showForm = !showForm;
	}
</script>

<title>{userData.username}'s Book List</title>
<nav class="listNav">
	<a
		href="/profile/{username}/list/All"
		class:selected={$page.url.pathname === '/profile/' + userData.username + '/list/All'}>All</a
	>
	<a
		href="/profile/{username}/list/"
		class:selected={$page.url.pathname === '/profile/' + userData.username + '/list'}>Reading</a
	>
	<a
		href="/profile/{username}/list/Planning"
		class:selected={$page.url.pathname === '/profile/' + userData.username + 'list/Planning'}
		>Plan to Read</a
	>
	<a
		href="/profile/{username}/list/Paused"
		class:selected={$page.url.pathname === '/profile/' + userData.username + 'list/Paused'}
		>Paused</a
	>
	<a
		href="/profile/{username}/list/Dropped"
		class:selected={$page.url.pathname === '/profile/' + userData.username + 'list/Dropped'}
		>Dropped</a
	>
	<a
		href="/profile/{username}/list/Completed"
		class:selected={$page.url.pathname === '/profile/' + userData.username + 'list/Completed'}
		>Completed</a
	>
</nav>
<button class="addButton" on:click|preventDefault={toggleForm}>
	<span class="material-symbols-round"> add </span>
	<span class="addText">Add Book</span>
</button>

{#if showForm}
	<div class="editor-popout" transition:fade={{ duration: 300 }}>
		<form method="POST" action="/profile/{username}/list/addBook?/addBook">
			<div class="editor">
				<div class="ebutton">
					<button formaction="/profile/{username}/list/addBook?/addBook" type="submit">Save</button>
				</div>
				<button type="button" class="cancelButton" on:click={toggleForm}>
					<span class="material-icons">close</span>
				</button>
				<div class="editor-container">
					<div class="e-userStatus">
						<div class="e-1">
							<input type="text" name="title" placeholder="Title" />
							<input type="text" name="author" placeholder="Author" />
							<input type="date" name="startDate" placeholder="Start Date" />
							<input type="date" name="finishDate" placeholder="Finish Date" />
						</div>

						<div class="e-2">
							<select id="status" name="status">
								<option value={2}>Reading</option>
								<option value={3} id="defaultOption">Plan to Read</option>
								<option value={4}>Paused</option>
								<option value={5}>Dropped</option>
								<option value={6}>Completed</option>
							</select>
							<select class="e-rating" name="rating" id="rating">
								<option value="0">Select</option>
								<option value="1">(1) Appalling</option>
								<option value="2">(2) Horrible</option>
								<option value="3">(3) Very Bad</option>
								<option value="4">(4) Bad</option>
								<option value="5">(5) Average</option>
								<option value="6">(6) Fine</option>
								<option value="7">(7) Good</option>
								<option value="8">(8) Good</option>
								<option value="9">(9) Great</option>
								<option value="10">(10) Masterpiece</option>
							</select>
							<input type="number" id="rereads" min="0" name="rereads" placeholder="Rereads" />
							<textarea name="notes" placeholder="Enter Note" />
						</div>
						<div class="e-3">
							<input type="number" id="chapters" name="tpages" min="0" placeholder="Total Pages" />
							<input type="number" id="pages" name="pages" min="0" placeholder="Pages" />
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>

	<div id="overlay" transition:fade={{ duration: 300 }} />
{/if}

<slot />

<style>
	* {
		margin: 0;
		padding: 0;
		text-decoration: none;
		font-family: 'Overpass', sans-serif;
	}

	.addButton {
		margin-top: 1rem;
		margin-left: 23%;
		background-color: #fafafa;
		text-align: center;
		border-radius: 20px;
		border: none;
		cursor: pointer;
		position: relative;
		padding: 0;
		width: 40px;
		height: 40px;
		transition: width 0.3s; /* Added transition property for smooth animation */
	}

	.addText {
		opacity: 0;
		position: absolute;
		top: 50%;
		left: 55%;
		width: 5rem;
		transform: translate(-50%, -50%);
	}

	.material-symbols-round {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%); /* Center the symbol vertically and horizontally */
		font-family: 'Material Symbols Rounded';
		font-size: 20px;
		transition: left 0.3s; /* Added transition property for smooth horizontal movement */
	}

	.addButton:hover {
		transition: 0.3s ease-in-out;
		width: 8rem;
	}

	.addButton:hover .material-symbols-round {
		transition: 0.3s ease-in-out;
		left: calc(50% - 2.75rem); /* Adjust the horizontal position to counter the increased width */
	}

	.addButton:hover .addText {
		opacity: 1;
		transition: 0.7s ease-in-out;
	}

	.listNav {
		display: flex;
		align-items: center;
		padding: 0 20%;
		justify-content: space-around;

		background: #fafafa;
	}

	nav a {
		color: #5c7289;
		font-weight: 600;
		font-size: 13px;
		padding: 1rem 0rem;
		transition: all 0.3s ease-in-out;
	}

	nav a:hover {
		color: #1faafa;
	}

	nav a.selected {
		color: #1faafa; /* Change this to the desired color for the active page */
	}

	#overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		pointer-events: auto;
		backdrop-filter: blur(0.35px);
		background-color: rgb(43, 45, 66, 0.3);
	}

	.editor-popout {
		height: 40%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fafafa;
		box-shadow: 0 2px 5px rgb(0, 0, 0, 0.1);
		border-radius: 8px;
		z-index: 999;
		transition: opacity 0.3s ease-in;
	}

	.cancelButton {
		margin: 7px;
		border: none;
		outline: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		position: absolute;
		top: 0; /* Position the button at the top */
		right: 0; /* Position the button at the right */
		color: #a3a3a3;
		transition: all 0.3s ease-in-out;
	}

	.cancelButton .material-icons {
		font-family: 'Material Icons';
		display: inline-block;
		vertical-align: middle;
	}

	.cancelButton:hover {
		color: #7e7e7e;
	}

	.editor-popout form {
		display: flex;
	}
	.editor-container {
		height: inherit;
		/* border-radius: 15px; */
		padding: 4rem 2rem;
		/* background-color: rgb(250, 250, 250, 0.96); */
	}

	.e-userStatus {
		display: flex;
		justify-content: space-between;
		width: 40rem;
		/* gap: 1rem; */
	}

	.e-userStatus select,
	.e-userStatus input,
	.e-userStatus textarea {
		margin-bottom: 1rem;

		align-items: end;
		padding: 0.4rem;
		color: #5c7289;
		border: none;
		border-radius: 4px;
		background-color: #edf1f5;
	}

	.e-userStatus textarea {
		width: 160%;
	}

	.ebutton button {
		border: none;
		border-radius: 5px;
		padding: 0.5rem;
		margin-top: 1rem;
		margin-left: 2rem;
		cursor: pointer;
		background-color: #007bff;
		color: #fff;
		transition: background-color 0.3s ease;
	}

	.ebutton button:hover {
		background-color: #0089fa;
	}
</style>
