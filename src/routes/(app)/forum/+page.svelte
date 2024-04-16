<script>
    /** @type {import('./$types').PageData} */
    import { goto } from '$app/navigation'; 
    import { page } from '$app/stores';
    import { formatDate, filterDataLastDay } from '$lib/utils';
    import { fade, fly, scale } from 'svelte/transition'; 
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
    import ThreadNavBar from './threadNavBar.svelte';
    export let data;
    let form;
    let threads = data.threads.filter(thread => !thread.isPinned);
    let pinnedThreads = data.threads.filter(thread => thread.isPinned);
    $: inputValue = '';

    $: selectedFeed = 'Recent';
    const feed = ['Recent', 'New', 'Subscribed']

    $: sort = false
    function openSort() {
        sort = !sort
    }
    
    function selectFeed(item) {
        selectedFeed = feed[item]; 
        sort = !sort
    }
    const search = () => {
		return async ({ result, update }) => {
            threads = result.data.search
			await invalidateAll()
		};
	};

    function threadCreation () {
        goto('/forum/thread/new')
    }
    const feedSelection = (formElement) => {
        selectFeed(formElement.formData.get('feedSelection'))
		return async ({ result, update }) => {
            const updatedThreads = result.data.threads;
            threads = updatedThreads.filter(thread => !thread.isPinned)
            pinnedThreads = updatedThreads.filter(thread => thread.isPinned);
            await update();
			await invalidateAll()
		};
	};
</script>

<title>Forum</title>

<div class="container">
    <ThreadNavBar foo={data.categories}/>
    <div class="header">
        <h1>Forum</h1>
        <button on:click={threadCreation} class="createThread">Create Thread</button>
    </div>
	<form bind:this={form} method="post" action="?/search" class="search-container" use:enhance={search}>
		<input on:input={() => form.requestSubmit()} bind:value={inputValue} type="search" class="search-box" name="search" placeholder="Search Forum"/>
		<span class="material-icons">search</span>
	</form>

    <div class="subHeader">
        <div class="sort">
            <button on:click={openSort}>
            <div class="sortSelected"><span class="material-symbols-outlined" style="font-size: 18px;" in:fade={{ duration: 300 }}>expand_all</span>{selectedFeed}</div>
            </button>
            {#if sort}
                <div class="dropdown" in:fade={{ duration: 200 }}>
                    {#each feed as item, i}
                    <form action="?/feedSelection" method="post" use:enhance={feedSelection}>
                        <input type="hidden" name="feedSelection" bind:value="{i}">
                        <button type="submit" class="dropSort" class:selected={selectedFeed === item ? 'highlight' : ''}>{item}</button>
                    </form>
                    {/each}
                </div>
                
			{/if}
        </div>
    </div>
    <div class="thread-container">  
        {#if pinnedThreads && pinnedThreads?.length > 0}
            {#each pinnedThreads as thread}
                <div class="statusCard">
                    <div class="statusContent">
                        <div class="statusHeader">
                            <span class="material-symbols-outlined">keep</span>
                            <a href="/forum/thread/{thread.id}">
                                <div class="title">{thread.title}</div>
                            </a>
                        </div>
                        <div class="statusBookContainer">
                            {#each thread.book as book}
                                <div class="statusBook">{book.englishTitle}</div>
                            {/each}
                            {#each thread.category as category}
                                <div class="statusBook" style="background-color: {category.color}">{category.name}</div>
                            {/each}
                        </div>
                        <div class="content">
                            <p>{thread.threadBody.slice(0, 130)}...</p>
                        </div>
                    </div>
                    <div class="statusRight">
                        <div class="view-container">
                            <span class="material-icons">visibility</span> 
                            <div>{thread.views}</div>
                        </div>  
                        <!-- {formatDate(thread.createdAt)} -->
                    </div>
                </div>
            {/each}
        {/if}
        {#if threads && threads?.length > 0}
        {#each threads as thread}
            <div class="statusCard">
                <div class="statusContent">
                    <div class="statusHeader">
                        <a href="/forum/thread/{thread.id}">
                            <div class="title">{thread?.title}</div>
                        </a>
                    </div>
                    <div class="statusBookContainer">
                        {#each thread?.book as book}
                            <div class="statusBook">{book?.englishTitle}</div>
                        {/each}
                        {#each thread.category as category}
                            <div class="statusBook" style="background-color: {category.color}">{category.name}</div>
                        {/each}
                    </div>
                    <div class="content">
                        <p>{thread.threadBody?.slice(0, 130)}...</p>
                    </div>
                    <div class="statusFooter">
                        <button>
                            <div class="commentContainer">
                                <span class="material-symbols-outlined" style="font-size: 17px;">forum</span>  
                                <div>{thread.Comment?.length}</div>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="statusRight">
                    <div class="view-container">
                        <span class="material-icons">visibility</span> 
                        <div>{thread.views}</div>
                    </div>  
                    <!-- {formatDate(thread.createdAt)} -->
                </div>
            </div>
        {/each}
        {/if}
    </div>
    
</div>


<style>
	* {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
        box-sizing: border-box;
	}

    h1 {
        font-size: 22px;
        color: #5e5e5e;
    }


	:root {
		background-color: #edf1f5;
	}

    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';

        font-variation-settings:
        'FILL' 1,
        'wght' 500,
        'GRAD' 200,
        'opsz' 20
    }
    

	a {
		text-decoration: none;
	}

    .header {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
    }

	.container {
        padding: 2rem;
		max-width: 65%; 
		margin: 0 auto; 
	}   

    .createThread {
        padding: 7px 14px;
        color: #fff;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        background-color: #3577ff;
        transition: all 0.3s ease-in-out;
    }

    .createThread:hover {
        background-color: #4f8aff;
    }

	.search-container {
		display: flex;
		align-items: center;
		position: relative;
		margin-bottom: 1rem;
	}

    .search-container span {
        font-weight: 500;
		font-size: 21px; 
		color: #9e9e9e;
		padding: 0px 10px;
		position: absolute;
    }

    .search-box {
		padding: 10px 15px 10px 40px;
		border: none;
		border-radius: 7px;
		background-color: #fff;
		font-size: 15px;
		font-weight: 500;
		width: 100%;
		color: #5e5e5e;
		height: 40px;
		box-shadow: 0px 2px 4px rgba(37, 34, 63, 0.07);
        transition: all 0.3s ease-in-out;
	}
	.search-box:focus {
		outline: none;
        box-shadow: 0px 2px 10px rgba(37, 34, 63, 0.15);
	}

    input::placeholder {
		color: rgb(149, 149, 149);
        font-size: 14px;
        font-weight: 500;
	}

	.material-icons {
		font-family: 'Material Icons';
	}


    .commentContainer {
        display: flex;
        align-items: center;
        color: #9299a1;
        gap: 5px;
        cursor: pointer;
    }

    .commentContainer:hover {
        color: #8092a0;
    }

    .thread-container {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .statusCard {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0.8rem 1rem;
		box-sizing: border-box;
		border-radius: 4px;
		background-color: #fafafa;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.004);
		transition: transform 0.3s, box-shadow 0.3s ease-in-out;
	}

    .title {
        font-size: 19px;
		font-weight: 500;
		color: #5e5e5e;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .title:hover {
        color: #1faafa;
    }

	.statusContent {
		display: flex;
		flex-direction: column;
        gap: 2px;
	}

    .statusBookContainer {
        padding: 4px 0;
        display: flex;
        gap: 5px;
    }

    .statusBook {
        font-style: oblique;
        padding: 3px 11px;
        color: #fff;
        background-color: #1faafa;
        border-radius: 14px;
        font-size: 11px;
        cursor: pointer;
    }

    .statusFooter button {
        border: none;
        background-color: transparent;
        cursor: pointer;
    }

	.content {
		display: flex;
		word-break: break-all;
		line-height: 25px;
        font-size: 14px;
        color: #9299a1;
	}

	.statusHeader {
		display: inline-flex;
		align-items: center;
        gap: 4px;
	}

    .statusHeader span {
        font-size: 15px;
        color: #1ffa56;
    }

    .statusRight span {
        font-size: 14px;
        font-weight: 400;
        margin-right: 4px;
    }

	.view-container {   
        display: inline-flex;
		color: #9299a1;
		font-size: 12px;
		font-weight: 400;
	}

    .subHeader {
        display: flex;
        justify-content: right;
        margin: 1rem;
    }

    .sort button {
        padding: 3px;
        border: none;
        font-size: 14px;
		color: #8092a0;
		font-weight: 600;
        background-color: transparent;
        cursor: pointer;
    }

    .sortSelected {
        display: flex;
        align-items: center;
        justify-content: right;
        width: 5rem;
    }

    .dropdown {
		display: flex;
		flex-direction: column;
		align-items: start;
		position: absolute;
		width: 6rem;
        margin-top: 0.5rem;
        padding: 0.5rem 0.5rem;
		cursor: pointer;
		background-color: #fbfbfb;
		box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
		border-radius: 7px; 
	}

	.dropdown::before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 60%; 
		transform: translateX(-50%); 
		border-width: 7px;
		border-style: solid;
		border-color: transparent transparent #fbfbfb transparent;
	}

	.dropSort {
        display: flex;
        justify-content: right;
        padding: 7px 0;
		border: none;
		font-size: 14px;
		font-weight: 600;
        width: 100%;
		background-color: #fbfbfb;
		color: #1b1b1b;
		transition: background-color 0.3s;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

    .dropdown button.selected {
        color: #1faafa;
    }

	.dropSort:hover {
		color: #1faafa;
	}
</style>