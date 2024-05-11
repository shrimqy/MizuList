import { db } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";
import { log } from "console";
import { env } from "process";
let username, bookId, isbn, work, matchingBooks;
let userBook = null,
  userFavorite = null,
  favorite = null;
let book;
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
  bookId = await params.bookId;
  if (!bookId) {
    throw redirect("/");
  }

  if (locals && locals.user && locals.user.id) {
    username = locals?.user?.name;
    const userID = locals?.user?.id;

    userFavorite = await db.Favorite.findFirst({
      where: {
        bookID: bookId,
        user: {
          some: { username },
        },
      },
    });

    favorite = await db.Favorite.findFirst({
      where: {
        bookID: bookId,
      },
      include: {
        user: true,
      },
    });
    userBook = await db.UserBook.findUnique({
      where: {
        userID_bookID: {
          userID: userID,
          bookID: bookId,
        },
      },
      include: {
        bookCategory: true,
      },
    });
  }

  book = await db.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      SeriesBook: {
        include: {
          series: true,
        },
      },
      genres: true,
      tag: true,
      userBooks: {
        include: {
          bookCategory: true,
        },
      },
      review: {
        include: {
          user: true,
        },
      },
    },
  });

  let recommendations = await db.recommendation.findMany({
    where: {
      OR: [{ book1Id: bookId }, { book2Id: bookId }],
    },
    include: {
      Like: true,
      book1: {
        select: {
          id: true,
          coverUrl: true,
          englishTitle: true,
        },
      },
      book2: {
        select: {
          id: true,
          coverUrl: true,
          englishTitle: true,
        },
      },
    },
    orderBy: {
      Like: {
        User: {
          _count: "desc",
        },
      },
    },
  });

  let finalAutoRecommendations = [];

  const res = await fetch(
    `https://book-recommendation-system-q163.onrender.com/recommend?book=${book.englishTitle}`
  );
  const autoRecommendation = await res.json();

  if (!autoRecommendation.error) {
    for (const recommendation of autoRecommendation) {
      // Find the book in the database by its title
      const book = await db.book.findFirst({
        where: {
          englishTitle: {
            contains: recommendation.book,
            mode: "insensitive",
          },
        },
      });

      // If the book is found, gather necessary data
      if (book) {
        finalAutoRecommendations.push({
          bookId: book.id,
          englishTitle: book.englishTitle,
          coverUrl: book.coverUrl,
        });
      }
    }
  }

  await db.book.update({
    where: {
      id: bookId,
    },
    data: {
      views: book.views + 1,
    },
  });

  const threads = await db.thread.findMany({
    take: 2,
    where: {
      book: {
        some: {
          id: bookId,
        },
      },
    },
    include: {
      book: true,
      Comment: true,
      category: true,
    },
  });

  const userFavoriteKEY = userFavorite !== null;

  return {
    book: book,
    userBook: userBook,
    favorite: favorite,
    userFavorite: userFavorite,
    favorite: favorite,
    userFavoriteKEY: userFavoriteKEY,
    recommendations: recommendations,
    autoRecommendation: finalAutoRecommendations,
    threads: threads,
  };
}
/** @type {import('./$types').Actions} */
export const actions = {
  //add to favorite Action definiion

  addFav: async ({ locals }) => {
    //throw redirect to login if user isn't logged in
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    const user = await db.User.findUnique({
      where: { username },
    });

    // if it does, update the record with the user else create the record with bookId and connec the user.
    if (userFavorite) {
      await db.Favorite.update({
        where: { id: favorite.id }, // Provide the unique identifier of the existing record
        data: {
          user: { disconnect: { id: user.id } },
        },
      });
    } else if (favorite) {
      await db.Favorite.update({
        where: { id: favorite.id }, // Provide the unique identifier of the existing record
        data: {
          user: { connect: { id: user.id } },
        },
      });
    } else {
      console.log("else");
      await db.Favorite.create({
        data: {
          book: { connect: { id: bookId } },
          user: { connect: { id: user.id } },
        },
      });
    }
    return { success: true };
  },

  //Add to List Function
  userStatus: async ({ request, params, locals }) => {
    //redirect if mot logged in
    if (!(locals && locals.user && locals.user.name)) {
      throw redirect(302, "/login");
    }
    //getting form data
    const bookId = await params.bookId;
    const data = await request.formData();
    let rating = data.get("rating");
    if (rating === "0") {
      rating = null;
    }
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
    const user = await db.user.findUnique({
      where: { username },
    });

    const existingBook = await db.userBook.findFirst({
      where: {
        userID: user.id,
        bookID: bookId,
      },
    });

    //Creating activity
    //only updating when there is any change in the data in condition
    if (
      existingBook?.rating !== rating ||
      existingBook?.pages !== pages ||
      existingBook?.chapters !== chapters ||
      existingBook?.bookCategory[1].id !== categoryId ||
      existingBook?.rereads !== rereads
    ) {
      await db.activity.create({
        data: {
          bookID: bookId,
          title: book.englishTitle,
          chapter: chapters,
          pages: pages,
          rating: rating,
          userID: user.id,
          categoryId: categoryId,
        },
      });
    }
    // Creating/updating the userStatus
    if (existingBook) {
      await db.userBook.update({
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
      });

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
      const ratingCount = ratings.length ? ratings.length : 1;
      const sumOfRatings = ratings.reduce(
        (total, userBook) => total + parseInt(userBook.rating),
        0
      );
      const avgRating = ratingCount > 0 ? sumOfRatings / ratingCount : 0;
      await db.Book.update({
        where: { id: bookId },
        data: {
          publicRating: avgRating,
          ratingCount: ratingCount,
        },
      });
    } else {
      await db.userBook.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          book: {
            connect: { id: bookId },
          },
          pagesRead: pages,
          chaptersRead: chapters,
          rating: rating,
          rereads: rereads,
          startedDate: startedDateTime,
          notes: notes,
          completedAt: completedDateTime,
          bookCategory: {
            // Connecting the new category and the "All" category to the book
            connect: [{ id: categoryId }, { id: 1 }],
          },
        },
      });

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
      const ratingCount = ratings.length ? ratings.length : 1;
      const sumOfRatings = ratings.reduce(
        (total, userBook) => total + parseInt(userBook.rating),
        0
      );
      const avgRating = ratingCount > 0 ? sumOfRatings / ratingCount : 0;
      await db.Book.update({
        where: { id: bookId },
        data: {
          publicRating: avgRating,
          ratingCount: ratingCount,
        },
      });
    }
    return { success: true };
  },

  delete: async ({ request, params, locals }) => {
    const data = await request.formData();
    const bookId = await params.bookId;
    const existingBook = await db.userBook.findFirst({
      where: {
        userID: locals.user.id,
        bookID: bookId,
      },
    });
    if (existingBook) {
      await db.book.update({
        where: { id: bookId },
        data: {
          publicRating: book.rating,
          ratingCount: book.ratingCount - 1,
        },
      });
      // Delete the existing book based on its unique identifier
      await db.userBook.delete({
        where: {
          userID_bookID: {
            userID: locals.user.id,
            bookID: bookId,
          },
        },
      });
    }
  },

  TLDRreview: async () => {
    const combinedReviewText = book.review
      .map((review) => review.review)
      .join(" ");
    const cleanedReviewText = combinedReviewText.replace(/['"\n]/g, "");
    // console.log(cleanedReviewText);
    let result;
    const url =
      "https://tldrthis.p.rapidapi.com/v1/model/abstractive/summarize-text/";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.KEY,
        "X-RapidAPI-Host": "tldrthis.p.rapidapi.com",
      },
      body: JSON.stringify({
        text: cleanedReviewText.slice(0, 1000),
        min_length: 100,
        max_length: 300,
      }),
    };

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/Falconsai/text_summarization",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify({ inputs: cleanedReviewText.slice(0, 1000) }),
        }
      );
      // const response = await fetch(url, options);
      result = await response.text();
    } catch (error) {
      console.error(error);
    }
    return {
      success: true,
      generatedReview: JSON.parse(result)[0].summary_text,
    };
  },
};
