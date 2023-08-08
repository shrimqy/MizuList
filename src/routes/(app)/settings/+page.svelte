<script>
	/** @type {import('./$types').PageData} */
	export let data;
	let { userData } = data;

	import { onMount } from 'svelte';
	import Navbar from './navbar.svelte';
	import { fade } from 'svelte/transition';
	let uploadedImage;
	let fileInput;

	function handleImageUpload(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = () => {
			uploadedImage = reader.result;
		};

		reader.readAsDataURL(file);
	}

	function openFileInput() {
		fileInput.click();
	}

	onMount(() => {
		const dropZone = document.getElementById('drop-zone');

		dropZone.addEventListener('dragover', (event) => {
			event.preventDefault();
			dropZone.classList.add('drag-over');
		});

		dropZone.addEventListener('dragleave', (event) => {
			event.preventDefault();
			dropZone.classList.remove('drag-over');
		});

		dropZone.addEventListener('drop', (event) => {
			event.preventDefault();
			dropZone.classList.remove('drag-over');
			const file = event.dataTransfer.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				uploadedImage = reader.result;
			};

			reader.readAsDataURL(file);
		});
	});

	let showSave = false;
	function toggleSave() {
		showSave = true;
	}
</script>

<div class="container">
	<Navbar />
	<div class="content" in:fade={{ duration: 300 }}>
		<div class="bio">
			<h3>Bio</h3>
			<form method="post" action="?/updateBio">
				<textarea
					on:focus={toggleSave}
					autocomplete="off"
					name="bio"
					placeholder={userData.bio ? userData.bio : 'A little about yourself...'}
					style="min-height: 51px; height: 95px;"
					bind:value={userData.bio}
				/>
				{#if showSave}
					<button formaction="?/updateBio" type="submit">Save</button>
				{/if}
			</form>
		</div>

		<div class="avatar">
			<h3>Avatar</h3>
			<p>Allowed Formats: PNG. Optimal dimensions: 230x230</p>
			<form
				class="avatarUpload"
				method="post"
				action="?/updateAvatar"
				enctype="multipart/form-data"
			>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="upload">
					<div id="drop-zone" class="drop-zone" on:click={openFileInput}>
						{#if uploadedImage}
							<div>
								<img src={uploadedImage} style="max-width: 50ch;" alt="" />
							</div>
						{:else}
							<p>Drop an image or click to upload.</p>
						{/if}
						<input
							formaction="?/updateAvatar"
							type="file"
							name="avatar"
							accept="image/png"
							on:change={handleImageUpload}
							bind:this={fileInput}
							style="display: none;"
						/>
					</div>
					<button
						class="button is-primary is-disabled"
						type="submit"
						formaction="?/updateAvatar"
						disabled={!uploadedImage}
					>
						Upload Image
					</button>
				</div>

				{#if userData && userData.avatar}
					<div class="avatarsaved">
						<img src={`/uploads/${userData.id}.png`} alt="User Avatar" class="user-avatar" />
					</div>
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

	* {
		font-family: 'Overpass', sans-serif;
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

	.bio textarea {
		margin-top: 1rem;
		color: #5c7289;
		border: none;
		outline: none;
		border-radius: 4px;
		resize: vertical;
		padding: 1rem;
		background-color: #f2f5f7;
		min-width: 100%; /* Expand the textarea to full width */
		box-sizing: border-box; /* Include padding and border in the width */
	}

	.bio button {
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

	.bio button:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.avatar {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.avatarUpload {
		display: flex;
	}

	.upload {
		border: 2px dashed #ccc;
		padding: 10px 10px;
		max-width: 40%;
		text-align: center;
		cursor: pointer;
	}

	.drop-zone {
		margin-bottom: 10px;
	}
	.drop-zone img {
		width: 60%;
	}

	.avatarsaved img {
		margin-left: 3rem;
		width: 50%;
	}
</style>
