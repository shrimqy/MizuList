<script>
	/** @type {import('./$types').PageData} */
	export let data;
	let { user } = data;
	let uploadedImage;

	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			uploadedImage = URL.createObjectURL(file);
		} else {
			uploadedImage = null;
		}
	}
</script>

<form method="post" action="?/updateAvatar" enctype="multipart/form-data">
	<input type="file" name="avatar" accept="image/*" on:change={handleImageUpload} />

	{#if uploadedImage}
		<div>
			<img src={uploadedImage} style="max-width: 50ch;" alt="" />
		</div>
	{/if}

	<div>
		<button
			class="button is-primary is-disabled"
			type="submit"
			formaction="?/updateAvatar"
			disabled={!uploadedImage}
		>
			Upload Image
		</button>
	</div>

	{#if user && user.avatar}
		<div>
			<img src={`/uploads/${user.username}.png`} alt="User Avatar" class="user-avatar" />
		</div>
	{/if}
</form>
