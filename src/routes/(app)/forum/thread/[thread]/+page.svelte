<script>
  import ThreadNavBar from "../../threadNavBar.svelte";
  import { formatDate, filterDataLastDay } from "$lib/utils";
  import Comment from "./Comment.svelte";
  /** @type {import('./$types').PageData} */
  export let data;
  let { thread, comments, user } = data;
  let commentText = "";
  let showComment = false;

  console.log(thread.Comment);

  function toggleComment(value) {
    showComment = value;
    if (!value) {
      commentText = "";
    }
  }

  let showReply = [];
  let replyText = [];

  function toggleReply(index, value) {
    showReply[index] = value;
    if (!value) {
      replyText[index] = "";
    }
  }
</script>

<div class="container">
  <ThreadNavBar foo={data.categories} />
  <div class="thread-container">
    <div class="statusCard">
      <div class="statusContent">
        <div class="userHeader">
          <div class="user">
            <img
              src={`/uploads/userAvatars/${thread.user?.id}.png`}
              alt="User Avatar"
              class="userstatusavatar"
            />
            <a
              data-sveltekit-preload-code
              href="/profile/{thread.user?.username}/"
              ><span class="username" style="margin: 0 0.5rem;"
                >{thread.user?.username}</span
              ></a
            >
          </div>
          <form action="?/subscribe" method="post">
            <div class="statusRight">
              <div class="subcriptionButton">
                <input type="hidden" value={thread.id} name="id" />
                <button formaction="?/subscribe"
                  >{user?.subscribedUsers?.length > 0
                    ? "Subscribed"
                    : "Subscribe"}</button
                >
              </div>
              <div class="view-container">
                <span class="material-icons">visibility</span>
                <div>{thread.views}</div>
              </div>
              <!-- {formatDate(thread.createdAt)} -->
            </div>
          </form>
        </div>
        <div class="statusHeader">
          <div class="title">{thread?.title}</div>
        </div>
        <div class="statusBookContainer">
          {#each thread?.book as book}
            <div class="statusBook">{book?.englishTitle}</div>
          {/each}
          {#each thread.category as category}
            <div class="statusBook" style="background-color: {category.color}">
              {category.name}
            </div>
          {/each}
        </div>
        <div class="content">
          <p>{thread.threadBody}</p>
        </div>
        <div class="statusFooter">
          <button>
            <div class="commentContainer">
              <span class="material-symbols-outlined" style="font-size: 17px;"
                >forum</span
              >
              <div>{thread._count?.Comment}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    {#if !thread.isLocked}
      <form method="post" action="?/createComment">
        <div class="activityStatus">
          <input
            type="text"
            placeholder="Add a comment"
            name="text"
            bind:value={commentText}
            autocomplete="off"
            on:input={() => toggleComment(true)}
          />
          {#if showComment}
            <p>Please mind user behavior before posting</p>
            <div class="actions">
              <button
                class="publish"
                type="button"
                style="background-color:#fafafa; color:#9299b5"
                on:click={() => toggleComment(false)}>Cancel</button
              >
              <button class="publish" formaction="?/createComment"
                >Comment</button
              >
            </div>
          {/if}
        </div>
      </form>
      <div class="comments-container">
        {#each comments as item, index}
          <Comment {item} expanded />
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  * {
    margin: 0px;
    padding: 0px;
    font-family: "Overpass", sans-serif;
    box-sizing: border-box;
    outline: none;
  }

  :root {
    background-color: #edf1f5;
  }

  a {
    text-decoration: none;
  }

  .material-symbols-outlined {
    font-family: "Material Symbols Outlined";

    font-variation-settings:
      "FILL" 1,
      "wght" 500,
      "GRAD" 200,
      "opsz" 20;
  }

  .material-icons {
    font-family: "Material Icons";
  }

  .container {
    padding: 2rem;
    max-width: 85%;
    margin: 0 auto;
  }

  .thread-container {
    display: flex;
    flex-direction: column;
    gap: 0px;
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
    transition:
      transform 0.3s,
      box-shadow 0.3s ease-in-out;
  }

  .userHeader {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .user {
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

  .title {
    font-size: 19px;
    font-weight: 500;
    color: #5e5e5e;
    transition: all 0.2s ease-in-out;
  }

  .nester {
    display: flex;
    position: absolute;
  }

  .nest {
    margin: 0 17px;
  }

  .threadline {
    width: 2px;
    background-color: #b4aa9d;
    position: absolute;
    top: 0;
    left: 20px;
    bottom: 0;
    z-index: -1;
  }

  .statusContent {
    display: flex;
    width: 100%;
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

  .statusRight {
    display: flex;
    align-items: center;
    gap: 10px;
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

  .activityStatus p {
    text-align: right;
    font-size: 12px;
    font-weight: 400;
  }

  .activityStatus input:focus .activityStatus p {
    text-align: right;
    margin-top: 1rem;
    font-size: 11px;
    font-weight: 400;
  }

  .activityStatus input::placeholder {
    color: #aeb5bd;
    font-size: 13px;
  }

  .activityStatus input:focus {
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
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

  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .subcriptionButton button {
    outline: none;
    border: none;
    padding: 6px;
    border-radius: 7px;
    cursor: pointer;
  }
</style>
