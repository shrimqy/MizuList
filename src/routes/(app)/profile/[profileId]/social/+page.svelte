<script>
    /** @type {import('./$types').PageData} */
    export let data;
    let { userSocial } = data;
    let selectedTab = 'following'; // Default to followers tab

    // Function to change the selected tab
    function selectTab(tab) {
        selectedTab = tab;
    }
</script>

<div class="container">
    <!-- Tab selection buttons -->
    <div class="tabs">
        <button on:click={() => selectTab('followers')} class:selected={selectedTab === 'followers'}>Followers</button>
        <button on:click={() => selectTab('following')} class:selected={selectedTab === 'following'}>Following</button>
    </div>
    
    <!-- Display followers or following based on selection -->
    <div class="userList">
        {#if selectedTab === 'followers'}
            {#each userSocial.followedBy as user}
                <div class="userCard">
                    <img
                        src={`/uploads/userAvatars/${user.id}.png`}
                        alt="User Avatar"
                        class="userAvatar"
                    />
                    <div class="username">{user.username}</div>
                </div>
            {/each}
        {:else if selectedTab === 'following'}
            {#each userSocial.following as user}
                <div class="userCard">
                    <img
                        src={`/uploads/userAvatars/${user.id}.png`}
                        alt="User Avatar"
                        class="userAvatar"
                    />
                    <div class="username">{user.username}</div>
                </div>
            {/each}
        {/if}
    </div>
    
</div>

<style>
    .container {
        padding: 2rem;
        max-width: 65%;
        margin: 0 auto;
    }

    .tabs {
        display: flex;
        gap: 1rem;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .tabs button.selected {
        font-weight: bold;
    }

    .userList {
        display: flex;
        background-color: #fafafa;
        padding: 1rem;
        border-radius: 7px;
        gap: 1rem;
    }

    .userCard {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 7px;
        background-color: #f5f5f5;
    }

    .username {
		font-size: 15px;
		font-weight: bold;
        color: #5C728A;
	}

    .userAvatar {
        height: 54px;
		width: 54px;
		border-radius: 50%;
		object-fit: cover;
    }
</style>