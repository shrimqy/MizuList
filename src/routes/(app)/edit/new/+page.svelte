<script>
	/** @type {import('./$types').PageData} */
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { redirect } from '@sveltejs/kit';
	import { page } from '$app/stores';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { goto, invalidateAll } from '$app/navigation';
	export let data;
    export let form;

    $: searchRes = null

    const searchGenre = () => {
		return async ({ result, update }) => {
			searchRes = result.data.searchRes
			await invalidateAll()
		};
	};

    const createSeries = () => {
		return async ({ result, update }) => {
			if (result.data.success = true) {
                saveSeries(result.data.seriesID, result.data.seriesName)
                selected = null
            }
			await invalidateAll()
		};
	};

    const bookSubmit = ({formData, formElement, action}) => {
        selectedSeries.forEach((series, index) => {
            // Convert selectedSeries array to JSON string
            const seriesData = JSON.stringify(selectedSeries);
            // Append series data as a single form field to formData
            formData.append('series', seriesData);
        });
        return async ({ result, update }) => {
			await invalidateAll()
            await update({ reset: true });
		};
    }

    let showForm = false;
    let popupSearchForm = false
    let popupCreateForm = false

	function toggleSearchForm() {
		showForm = !showForm;
        popupSearchForm = !popupSearchForm
	}

    function toggleCreateForm() {
		showForm = !showForm;
        popupCreateForm = !popupCreateForm
	}

    $: selectedSeries = []
    function saveSeries(seriesID, seriesName) {
        showForm = !showForm;
        popupSearchForm = false;
        popupCreateForm = false;

        
        // Create a new object with seriesID and seriesName properties
        const series = { seriesID, seriesName };
        // Add the new object to the selectedSeries array
        selectedSeries = [...selectedSeries, series];
        console.log(selectedSeries);
    }
    $: Synonyms = [""];
    
    function SynonymsInput(Synonym, index) {
        Synonyms[index] = Synonym;
        Synonyms[index + 1] = "";
    }

	import MultiSelect from 'svelte-multiselect'
	import { onMount } from 'svelte';

    const genres = [
        { id: 2, name: 'Action', label: 'Action' },
        { id: 3, name: 'Fantasy', label: 'Fantasy' },
        { id: 4, name: 'Slice of Life', label: 'Slice of Life' },
        { id: 5, name: 'SuperNatural', label: 'SuperNatural' },
        { id: 6, name: 'Fiction', label: 'Fiction' },
        { id: 7, name: 'Non Fiction', label: 'Non Fiction' }
    ];	
	$: selected = []

</script>

<div class="container">
    <form method="post" action="?/newEntry" use:enhance={bookSubmit}>
    <div class="content">
        <h3>Title</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
			<div class="listInput">
                <h3>Romanized</h3>
                <input
                    type="text"
                    class="input"
                    name="title"
                />
            </div>
            <div class="listInput">
                <h3>English (Licensed)</h3>
                <input
                    type="text"
                    class="input"
                    name="title"
                />
            </div>
            <div class="listInput">
                <h3>Native</h3>
                <input
                    type="text"
                    class="input"
                    name="title"
                />
            </div>
        </div> 
    </div>
    <div class="content">
        <h3>Author</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
            <div class="listInput">
                <input
                    type="text"
                    class="input"
                    name="author"
                />
            </div>
        </div>    
    </div>
    <div class="content">
        <h3>Release Information</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
            <div class="listInput">
                <h3>First Published Date</h3>
                <input
                    type="date"
                    class="input"
                    name="releaseDate"
                />
            </div>
            <div class="listInput">
                <h3>ISBN</h3>
                <input
                    type="text"
                    class="input"
                    name="isbn"
                />
            </div>
            <div class="listInput">
                <h3>Publisher</h3>
                <input
                    type="text"
                    class="input"
                    name="publisher"
                />
            </div>
			
        </div>    
    </div>

	<div class="content">
        <h3>Lengths</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
            <div class="listInput">
                <h3>Chapters</h3>
                <input
                    type="number"
                    class="input"
                    name="chapters"
					min="0"
                />
            </div>
            <div class="listInput">
                <h3>Pages</h3>
                <input
                    type="number"
                    class="input"
                    name="pages"
					min="0"
                />
            </div>	
        </div>    
    </div>


    <div class="content">
		<h3>Genre</h3>
		<div class="sub-content" in:fade={{ duration: 300 }}>
			<div class="listInput">
				<MultiSelect bind:selected options={data.genres} name="genres" required/>
			</div>
		</div>    
	</div>

    <div class="content">
        <h3>Synonyms</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
            {#each Synonyms as item, index}
            <div class="listInput" on:input={() => SynonymsInput(item, index)}>
                <input
                    type="text"
                    class="input"
                    name="synonyms"
                    bind:value={item}
                />
            </div>
            {/each}
        </div>
    </div>

	<div class="content">
        <h3>Description</h3>
        <div class="listInput">
            <textarea
                class="sub-content"
                name="description"
                rows="3"
                style="border: none; resize: vertical;"	
            />
        </div>  
    </div>
    <div class="content">
        <h3>Series (Optional)</h3>
            <div class="sub-content">
                {#each selectedSeries as item, i}
                    <div class="listInput">
                        <h3>Series Name</h3>
                        <input class="selectedSeries" type="text" name="selectedSeries" bind:value={item.seriesName}>
                    </div>
                    <div class="listInput">
                        <h3>Book Position</h3>
                        <input
                            type="number"
                            class="input"
                            name="bookPosition"
                            min="0"
                        />
                    </div>
                {/each}
                    
                <button on:click|preventDefault={toggleSearchForm}>Add a related Series</button>
                <button on:click|preventDefault={toggleCreateForm}>Create a new Series</button>
            </div>  
    </div>
    {#if showForm}
        <div class="editor-popout" in:fade={{ duration: 500 }}>
            {#if popupSearchForm}
                <div class="editor-header">
                    <form method="POST" action="?/searchSeries" class="search-container" use:enhance={searchGenre}>
                        <input type="search" class="search-box" name="search" />
                        <span class="material-icons">search</span>
                    </form>
                    <button type="button" class="cancelButton" on:click={toggleSearchForm}>
                        <span class="material-icons">close</span></button
                    >
                </div>
                {#if searchRes}
                    <div class="results">
                        {#each searchRes as item}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                            <li class="searchResult" on:click={saveSeries(item.id, item.name)}> {item.name} </li>    
                        {/each}
                    </div>
                {/if}
            {/if}
            {#if popupCreateForm}
                <div class="editor-header">
                    <form method="POST" action="?/createSeries" class="createForm" use:enhance={createSeries}>
                        <div class="content" in:fade={{ duration: 300 }}>
                            <div class="listInput" >
                                <h3>Series Name</h3>
                                <input
                                    type="text"
                                    class="input"
                                    name="seriesName"
                                />
                            </div>
                            <div class="listInput">
                                <h3>Description</h3>
                                <textarea
                                    type="number"
                                    class="input"
                                    name="description"
                                    rows="4"
                                    cols="40"
                                    style="border: none;"	
                                />
                            </div>	
                        </div> 
                        <button type="submit">Save</button>
                    </form>
                    <button type="button" class="cancelButton" on:click={toggleCreateForm}>
                        <span class="material-icons">close</span></button
                    >
                </div>
            {/if}
        </div>
        <div id="overlay" in:fade={{ duration: 300 }} />
    {/if}
	<div class="content">
        <h3>Misc</h3>
        <div class="sub-content" in:fade={{ duration: 300 }}>
            <div class="listInput">
                <input
                    type="url"
                    class="input"
                    name="coverUrl"
                    placeholder="Cover Image Url"
                />
            </div>
            <div class="listInput">
                <input
                    type="url"
                    class="input"
                    name="amazonUrl"
                    placeholder="Amazon Url"
                />
            </div>
        </div>    
    </div>
    
<button formaction="?/newEntry" type="submit">submit</button>
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
        
    }

	.sub-content {
		display: flex;
		background-color: #fafafa;
		border-radius: 5px;
		padding: 1rem 1rem;
        margin: 0.5rem 0;
        gap: 30px;
        align-items: center;
	}


	.listInput {
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
		min-width: min-content;
		box-sizing: border-box;
	}

	input::placeholder {
		color: #9eb1c9;
	}

	button:hover {
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

    /* Style the search box */
	.search-container {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 1rem; /* Added margin */
	}

	.search-box {
		padding: 10px 15px 10px 40px;
		border: none;
		border-radius: 7px;
		background-color: #fff;
		font-size: 15px;
		font-weight: 600;
		width: 100%; /* Adjusted width */
		max-width: 300px; /* Added max-width */
		color: #5e5e5e;
		height: 40px;
		box-shadow: 0px 2px 10px rgba(37, 34, 63, 0.1);
	}
	.search-box:focus {
		outline: none;
	}

	.material-icons {
		font-family: 'Material Icons';
		font-weight: 600;
		font-size: 17px; /* Preferred icon size */
		color: #9e9e9e;
		padding: 0px 10px;
		position: absolute;
	}

    .editor-popout {
        
        width: 30%;
		height: 60%;
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

    .editor-header {
        padding: 1.5rem;
        display: flex;
        align-items: start;
        justify-content: space-between;
    }

    .cancelButton {
        width: 3rem;
		border: none;
		outline: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		color: #fff;
		transition: all 0.3s ease-in-out;
	}

	.cancelButton .material-icons {
		display: inline-block;
		vertical-align: middle;
	}

	.cancelButton:hover {
		color: #c4ced8;
        box-shadow: none;
	}

    .searchResult {
        display: flex;
        flex-direction: column;
        margin-left: 1.5rem;
        margin-right: 5rem;
        padding: 10px 14px;
        border-radius: 5px;
        cursor: pointer;
        background-color: #fff;
    }
    
    .selectedSeries {
        border: none;
		border-radius: 7px;
        color: #627891;
		background-color: #f2f5f7;
        padding: 10px 10px;

    }

    .createForm {
        display: flex; 
        height: 100%;
        flex-direction: column; 
        justify-content: space-between;
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

</style>
