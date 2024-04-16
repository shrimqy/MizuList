import { db } from '../../../../../lib/server/database';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
  const threadId = params.thread;

  const userId = locals.user.id;

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

  if (user.viewedThreads.length === 0) {
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

  const thread = await db.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      book: true,
      Comment: true,
      category: true,
      user: true,
    },
  });

  return { thread };
}