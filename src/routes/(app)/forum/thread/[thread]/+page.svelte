<script>
  import ThreadNavBar from '../../threadNavBar.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
    let thread = data.thread
    // console.log(thread);
</script>

<div class="container">
    <ThreadNavBar foo={data.categories} />
    <div class="thread-container">
        <div class="statusCard">
            <div class="statusContent">
                <div class="userHeader">
                    <img
                        src={`/uploads/userAvatars/${thread.user?.id}.png`}
                        alt="User Avatar"
                        class="userstatusavatar"
                    />
                    <a data-sveltekit-preload-code href="/profile/{thread.user?.username}/"
                        ><span class="username" style="margin: 0 1rem;">{thread.user?.username}</span></a
                    >
                </div>
                <div class="statusHeader">
                    <div class="title">{thread?.title}</div>
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
                    <p>{thread.threadBody}</p>
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
    </div>
</div>

<style>
    * {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
        box-sizing: border-box;
	}

    :root {
		background-color: #edf1f5;
	}

    a {
		text-decoration: none;
	}

    .material-symbols-outlined {
        font-family: 'Material Symbols Outlined';

        font-variation-settings:
        'FILL' 1,
        'wght' 500,
        'GRAD' 200,
        'opsz' 20
    }

    .material-icons {
		font-family: 'Material Icons';
	}


    .container {
        padding: 2rem;
		max-width: 65%; 
		margin: 0 auto; 
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
		padding: 1rem;
		box-sizing: border-box;
		border-radius: 4px;
		background-color: #fafafa;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.004);
		transition: transform 0.3s, box-shadow 0.3s ease-in-out;
	}

    .userHeader {
        display: flex;
        align-items: center;
        margin-bottom: 0.7rem;
    }

    .username {
		font-size: 16px;
		color: #3db4f2;
		font-weight: 500;
	}

	.userstatusavatar {
		will-change: transform;
		height: 34px;
		width: 34px;
		border-radius: 50%;
		object-fit: cover;
	}

    .title {
        font-size: 19px;
		font-weight: 500;
		color: #5e5e5e;
        transition: all 0.2s ease-in-out;
    }

	.statusContent {
		display: flex;
		flex-direction: column;
        gap: 5px;
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


</style>