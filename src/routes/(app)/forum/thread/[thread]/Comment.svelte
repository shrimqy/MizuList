<!-- CommentItem.svelte -->
<script>
    export let item;
    let index;
    export let expanded = false;
    console.log(item);
    // console.log(comments);
    let commentText = '';
    let showComment = false;

    function toggleComment(value) {
        showComment = value;
        if (!value) {
            commentText = '';
        }
    }

    let showReply = [];
    let replyText = [];

    function toggleReply(index, value) {
        showReply[index] = value;
        if (!value) {
            replyText[index] = '';
        }
    }
</script>

<div class="comment">
    <div class="userHeader">
        <img
            src={`/uploads/userAvatars/${item.user?.id}.png`}
            alt="User Avatar"
            class="userstatusavatar"
        />
        <a data-sveltekit-preload-code href="/profile/{item.user?.username}/"
            ><span class="username" style="margin: 0 0.5rem;">{item.user?.username}</span></a
        >
    </div>
    <div class="nester">
        <div class="nest">
            <div class="threadline" style="background-color: #b4aa9d;"></div>
        </div>
        <div class="commentContent">
            <div class="content">
                <p>{item.comment}</p>
            </div>
            <div class="statusFooter">
                <button on:click={() => toggleReply(index, true)}>
                    <div class="commentContainer">
                        <span class="material-symbols-outlined" style="font-size: 17px;">forum</span>  
                        <div>Reply</div>
                    </div>
                </button>
            </div>
        </div>
    </div>
   
    
    
    {#if showReply[index]}
    <form method="post" action="?/replyComment">
        <div class="activityStatus">
            <input
                type="text"
                placeholder="Add Reply"
                name="text"
                bind:value={replyText[index]}
                autocomplete="off"
                on:input={() => toggleReply(index, true)}
            />
            <input
                type="hidden"
                name="commentId"
                value={item.id}
            />
            {#if showReply[index]}
                <div class="actions">
                    <button
                        class="publish"
                        type="button"
                        style="background-color:#fafafa; color:#9299b5"
                        on:click={() => toggleReply(index, false)}>Cancel</button>
                    <button class="publish" formaction="?/replyComment">Comment</button>
                </div>
            {/if}
        </div>
    </form>
    {/if}
    {#if item.Children}
        {#each item.Children as child}
            {#if item.Children}
                <svelte:self item={child} />
            {/if}
        {/each}
    {/if}
</div>


<style>

    * {
		margin: 0px;
		padding: 0px;
		font-family: 'Overpass', sans-serif;
        box-sizing: border-box;
        outline: none;
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
    

    .userHeader {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
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

    .statusFooter button {
        border: none;
        background-color: transparent;
        cursor: pointer;
    }


    .actions {
		display: flex;
		gap: 10px;
		justify-content: right;
	}

	.actions button {
		border: none;
		background-color: #3db4f2;
		padding: 9px 13px;
		border-radius: 5px;
		color: #edf1f5;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		margin-top: 0.5rem;
	}


    .activityStatus {
		display: flex;
		flex-direction: column;
		align-items: right;
        margin: 1rem 0;
	}

    .activityStatus input {
		width: 100%;
		border: none;
		background-color: #fafafa;
		color: #585b5f;
		padding: 0.6rem 1rem;
		border-radius: 4px;
		box-sizing: border-box;
	}

	.activityStatus input::placeholder {
		color: #aeb5bd;
		font-size: 13px;
	}

	.activityStatus input:focus {
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
	}
</style>