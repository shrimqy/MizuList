<script>
	import { fade, fly, scale } from 'svelte/transition'; 
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	export let data;
	let form;
	$: inputValue = ''
	$: showSave=false
	function toggleSave() {
		showSave = !showSave
	}
	$: searchRes = null
    const searchCategories = () => {
		return async ({ result, update }) => {
			searchRes = result.data.searchRes
			await invalidateAll()
		};
	};
	
	console.log(data.categories);

	$: selected = []

	$: isCategory1Selected = selected.includes('1');
	$: books = []
</script>

<div class="container">
    <form method="post" action="?/newEntry">
        <div class="content">
			<input 
				type="text"
				class="input"
				name="title"
				placeholder="Thread title"
			/>
			<textarea
				class="sub-content"
				name="message"
				placeholder="Thread body"
				rows="5"
				style="resize: vertical;"
			/>
            
            <h3>Categories</h3>
			<div class="category-section">
				{#each data.categories as item, i}
					<div class="checkbox-wrapper">
						<input type="checkbox" bind:group={selected} name="category" value={item.id} id="category{i}" disabled={selected.length === 3 && !selected.includes(item.id)}>
						<label for="category{i}">{item.name}</label>
					</div>
				{/each}
			</div>
			<h3>Related Book Categories</h3>
			<form bind:this={form} method="post" action="?/search" class="search-container" use:enhance={searchCategories}>
				<input on:input={() => form.requestSubmit()} bind:value={inputValue} type="search" class="search-box" name="search"/>
				<span class="material-icons">search</span>
			</form>
			{#if searchRes && searchRes.length > 0 && inputValue !== ''}
				<div class="category-section" in:fade={{ duration: 500 }}>
					{#each searchRes as item, index}
						<div class="checkbox-wrapper" >
							<input type="checkbox" bind:group={books} name="book" value={item.id} id="book{index}" disabled={books.length === 2 && !books.includes(item.id)}>
							<label for="book{index}">{item.englishTitle}</label>
						</div>
					{/each}
				</div>
			{/if}
			<button id="submit-button" type="submit">Save</button>
		</div>
		
		<p id="category-error" style="display: none; color: red;">A thread category must be selected</p>
    </form>
</div>





<style>
	* {
		font-family: 'Overpass', sans-serif;
		outline: none;
		text-decoration: none;
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
		width: 45%;
		margin: 2rem auto;
	}

    .content {
        display: flex;
        flex-direction: column;
        padding: 0.2rem 0rem;
        color: #858585;
		gap: 10px;
    }

	.sub-content {
		display: flex;
		background-color: #fafafa;
		border-radius: 5px;
		padding: 1rem 1rem;
        margin: 0.5rem 0;
        gap: 30px;
        align-items: center;
		border: none;
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
		width: 100%;
		font-size: 15px;
		background-color: #fafafa;
		border-radius: 4px;
		padding: 12px; 
		box-sizing: border-box;
	}
	
	input[type="checkbox"] {
    	display: none; /* Hide the default checkbox */
	}

	.category-section {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
	}	

	.checkbox-wrapper {
		display: inline-block;
		position: relative;
	}

	.checkbox-wrapper input[type="checkbox"] + label {
		color: #858585;
		font-size: 15px;
		background-color: #ffffff;
		border-radius: 4px;
		padding: 7px 16px;
		min-width: 100%;
		box-sizing: border-box;
		display: inline-block;
		cursor: pointer;
		border: 1px solid transparent; 
		transition: all 0.2s ease-in-out;
	}

	.checkbox-wrapper input[type="checkbox"]:checked + label {
		color: #3db4f2;
		border: 1px solid #3db4f2; 
		outline: none; 
	}
	input::placeholder, textarea::placeholder{
		color: rgb(149, 149, 149);
	}

	button:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.search-container {
		display: flex;
		align-items: center;
		position: relative;
	}

	.search-box {
		padding: 10px 15px 10px 40px;
		border: none;
		border-radius: 7px;
		background-color: #fff;
		font-size: 15px;
		font-weight: 600;
		width: 100%; 
		max-width: 300px;
		color: #5e5e5e;
		height: 40px;
		box-shadow: 0px 2px 5px rgba(37, 34, 63, 0.05);
	}
	.search-box:focus {
		outline: none;
	}

	.material-icons {
		font-family: 'Material Icons';
		font-weight: 600;
		font-size: 17px;
		color: #9e9e9e;
		padding: 0px 10px;
		position: absolute;
	}

	
	
</style>
