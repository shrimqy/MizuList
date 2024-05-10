import { subscribe } from "diagnostics_channel";
import { db } from "../../../../../lib/server/database";
import { fail, redirect } from "@sveltejs/kit";

let threadId = null;
let user = null;
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  threadId = params.thread;

  const userId = locals?.user?.id;

  if (userId) {
    user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        viewedThreads: {
          where: {
            id: threadId,
          },
        },
        subscribedThreads: {
          where: {
            id: threadId,
          },
        },
      },
    });
    if (user?.viewedThreads?.length === 0) {
      await db.thread.update({
        where: {
          id: threadId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          viewedThreads: {
            connect: {
              id: threadId,
            },
          },
        },
      });
    }
  }

  const thread = await db.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      book: true,
      category: true,
      user: true,
      _count: {
        include: {
          Comment: true,
        },
      },
    },
  });

  console.log(thread);

  let comments = await db.comment.findMany({
    where: {
      parent_id: null,
      threadId: threadId,
    },
    include: {
      Children: {
        include: {
          Children: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      },
      user: true,
    },
  });
  console.log(user);
  return { thread: thread, comments: comments, user: user };
}

export const actions = {
  createComment: async ({ request, locals }) => {
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    const data = await request.formData();
    const commentText = data.get("text");

    //creates a new comment
    await db.comment.create({
      data: {
        userID: locals.user.id,
        comment: commentText,
        threadId: threadId,
      },
    });
    return { success: true };
  },

  subscribe: async ({ request, locals }) => {
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    const data = await request.formData();
    const id = data.get("id");

    if (user.subscribedThreads.length === 0) {
      await db.thread.update({
        where: {
          id: threadId,
        },
        data: {
          subscribedUsers: {
            connect: { id: user.id },
          },
        },
      });
    } else {
      await db.thread.update({
        where: {
          id: threadId,
        },
        data: {
          subscribedUsers: {
            disconnect: { id: user.id },
          },
        },
      });
    }
  },

  replyComment: async ({ request, locals }) => {
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    const data = await request.formData();
    const commentText = data.get("text");
    const parentId = parseInt(data.get("commentId"));
    await db.comment.create({
      data: {
        userID: locals.user.id,
        comment: commentText,
        threadId: threadId,
        parent_id: parentId,
      },
    });
    return { success: true };
  },
};
