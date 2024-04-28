import { db } from '../../../../../lib/server/database';
import { fail, redirect } from '@sveltejs/kit';

let threadId = null

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  threadId = params.thread;

  const userId = locals?.user?.id;

  if (userId) {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        viewedThreads: {
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
      Comment: {
        include: {
          user: true
        }
      },
      category: true,
      user: true,
    },
  });

  let comments = await db.comment.findMany({
    where: {
      parent_id: null,
    },
    include: {
      Children: {
        include: {
          Children: true,
          user: true
        },
      },
      user: true
    },
  });



  return { thread: thread, comments: comments };
}

export const actions = {
  createComment: async ({ request, locals}) => {
    if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
    const data = await request.formData();
		const commentText = data.get('text');

    //creates a new comment
		await db.comment.create({
			data: {
				userID: locals.user.id,
				comment: commentText,
        threadId: threadId,
			}
		});
		return { success: true };
  },

  replyComment: async ({ request, locals}) => {
    if (!(locals && locals.user && locals.user.name)) {
			throw redirect(302, '/login');
		}
    const data = await request.formData();
		const commentText = data.get('text');
    const parentId = parseInt(data.get('commentId'))
		await db.comment.create({
			data: {
				userID: locals.user.id,
				comment: commentText,
        threadId: threadId,
        parent_id: parentId
			}
		});
		return { success: true };
  }
}