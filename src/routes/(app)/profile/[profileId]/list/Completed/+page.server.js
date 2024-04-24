import { db } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";
let username;
let existingBook = null;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {};
}
/** @type {import('./$types').Actions} */
export const actions = {
  //Add to List Function
  userStatus: async ({ request, params, locals }) => {
    //redirect if mot logged in
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    //getting form data

    const data = await request.formData();
    let rating = data.get("rating");
    if (rating === "0") {
      rating = null;
    }
    const bookId = data.get("bookId");
    const status = data.get("status");
    const categoryId = parseInt(status, 10); //to convert the status to Int, shit doesn't work otherwise for somereason
    const chapters = data.get("chapters");
    const pages = data.get("pages");
    const rereads = data.get("rereads");
    const notes = data.get("notes");

    const startedAt = data.get("startDate");
    let startedDateTime = null;
    if (startedAt) {
      startedDateTime = new Date(startedAt).toISOString();
    }
    const completedAt = data.get("finishDate");
    let completedDateTime = null;
    if (completedAt) {
      completedDateTime = new Date(completedAt).toISOString();
    }
    // const user = await db.user.findUnique({
    //   where: { id: i },
    // });

    const existingBook = await db.userBook.findFirst({
      where: {
        userID: locals.user.id,
        bookID: bookId,
      },
      include: {
        book: {
          select: {
            englishTitle: true,
          },
        },
      },
    });

    //Creating activity
    //only updating when there is any change in the data in condition
    // if (
    //   existingBook?.rating !== rating ||
    //   existingBook?.pages !== pages ||
    //   existingBook?.chapters !== chapters ||
    //   existingBook?.bookCategory[1].id !== categoryId ||
    //   existingBook?.rereads !== rereads
    // ) {
    //   await db.activity.create({
    //     data: {
    //       bookID: bookId,
    //       title: book.englishTitle,
    //       chapter: chapters,
    //       pages: pages,
    //       rating: rating,
    //       userID: user.id,
    //       categoryId: categoryId,
    //     },
    //   });
    // }

    const ratings = await db.userBook.findMany({
      where: {
        bookID: bookId,
        rating: {
          not: null,
        },
      },
      select: {
        rating: true,
      },
    });
    const ratingCount = ratings.length;
    const sumOfRatings = ratings.reduce(
      (total, userBook) => total + parseInt(userBook.rating),
      0
    );
    console.log(existingBook);
    const avgRating = ratingCount > 0 ? sumOfRatings / ratingCount : 0;

    // Creating/updating the userStatus
    if (existingBook) {
      await db.Book.update({
        where: { id: bookId },
        data: {
          publicRating: avgRating,
          ratingCount: ratingCount,
          userBooks: {
            update: {
              where: {
                userID_bookID: {
                  userID: locals.user.id,
                  bookID: bookId,
                },
              },
              data: {
                pagesRead: pages,
                chaptersRead: chapters,
                rating: rating,
                rereads: rereads,
                startedDate: startedDateTime,
                notes: notes,
                completedAt: completedDateTime,
                bookCategory: {
                  // Disconnecting the category at index 1 from the existing book's categories
                  disconnect: [{ id: userBook?.bookCategory[1]?.id }],

                  // Connecting the new category and the "All" category to the book
                  connect: [{ id: categoryId }, { id: 1 }],
                },
              },
            },
          },
        },
      });
    } else {
      await db.Book.update({
        where: { id: bookId },
        data: {
          publicRating: avgRating,
          ratingCount: ratingCount,
          userBooks: {
            create: [
              {
                user: {
                  connect: { id: locals.user.id },
                },
                pagesRead: pages,
                chaptersRead: chapters,
                rating: rating,
                rereads: rereads,
                startedDate: startedDateTime,
                completedAt: completedDateTime,
                bookCategory: {
                  // Connecting the new category and the "All" category to the book
                  connect: [{ id: categoryId }, { id: 1 }],
                },
              },
            ],
          },
        },
      });
    }

    return { success: true };
  },

  delete: async ({ request, params, locals }) => {
    const data = await request.formData();
    const title = data.get("title");
    existingBook = await db.book.findFirst({
      where: {
        title,
        User: {
          some: { username },
        },
      },
      include: {
        bookCategory: true,
      },
    });
    if (existingBook) {
      // Delete the existing book based on its unique identifier
      await db.Book.delete({ where: { id: existingBook.id } });
    }
  },
};
