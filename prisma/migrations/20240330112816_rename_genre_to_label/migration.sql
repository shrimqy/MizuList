/*
  Warnings:

  - You are about to drop the column `UserId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `covers` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `rereads` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `tPages` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `bookId` on the `Fav` table. All the data in the column will be lost.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Recommendation` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `pages` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `tPages` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `activityText` on the `status` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `status` table. All the data in the column will be lost.
  - You are about to drop the `_UserBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userdisLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookID]` on the table `Fav` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookID` to the `Fav` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "_UserBook" DROP CONSTRAINT "_UserBook_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBook" DROP CONSTRAINT "_UserBook_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_userLikes" DROP CONSTRAINT "_userLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_userLikes" DROP CONSTRAINT "_userLikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_userdisLikes" DROP CONSTRAINT "_userdisLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_userdisLikes" DROP CONSTRAINT "_userdisLikes_B_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "activity" DROP CONSTRAINT "activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "disLike" DROP CONSTRAINT "disLike_recommendationId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "status" DROP CONSTRAINT "status_userId_fkey";

-- DropIndex
DROP INDEX "Fav_bookId_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "UserId",
DROP COLUMN "author",
DROP COLUMN "bookId",
DROP COLUMN "completedAt",
DROP COLUMN "covers",
DROP COLUMN "createdAt",
DROP COLUMN "notes",
DROP COLUMN "rating",
DROP COLUMN "rereads",
DROP COLUMN "tPages",
DROP COLUMN "updatedAt",
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "amazonUrl" TEXT,
ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "bookID" TEXT,
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "isbn" TEXT[],
ADD COLUMN     "publicRating" TEXT,
ADD COLUMN     "views" INTEGER;

-- AlterTable
ALTER TABLE "Fav" DROP COLUMN "bookId",
ADD COLUMN     "bookID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "id",
ADD COLUMN     "commentID" TEXT,
ADD COLUMN     "userID" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userID");

-- AlterTable
ALTER TABLE "Recommendation" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "roleID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "categoryId",
DROP COLUMN "pages",
DROP COLUMN "tPages",
DROP COLUMN "userId",
ADD COLUMN     "chapter" TEXT,
ADD COLUMN     "userID" TEXT;

-- AlterTable
ALTER TABLE "status" DROP COLUMN "activityText",
DROP COLUMN "userId",
ADD COLUMN     "text" TEXT;

-- DropTable
DROP TABLE "_UserBook";

-- DropTable
DROP TABLE "_UserFavorites";

-- DropTable
DROP TABLE "_userLikes";

-- DropTable
DROP TABLE "_userdisLikes";

-- DropTable
DROP TABLE "disLike";

-- DropTable
DROP TABLE "reviews";

-- CreateTable
CREATE TABLE "Genres" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "Tag" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBook" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "bookID" TEXT NOT NULL,
    "rating" TEXT,
    "rereads" INTEGER,
    "notes" TEXT,
    "startedDate" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UserBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "bookId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "review" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "spoiler" TEXT NOT NULL,
    "rating" TEXT,
    "title" TEXT,
    "covers" TEXT,
    "userID" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "statusId" TEXT,
    "activityId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisLike" (
    "userID" TEXT NOT NULL,
    "recommendationId" TEXT,

    CONSTRAINT "DisLike_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BookToTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BookToGenres" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBook_userID_bookID_key" ON "UserBook"("userID", "bookID");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToTag_AB_unique" ON "_BookToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToTag_B_index" ON "_BookToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToGenres_AB_unique" ON "_BookToGenres"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToGenres_B_index" ON "_BookToGenres"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Fav_bookID_key" ON "Fav"("bookID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookID_fkey" FOREIGN KEY ("bookID") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTag" ADD CONSTRAINT "_BookToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToTag" ADD CONSTRAINT "_BookToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookToGenres" ADD CONSTRAINT "_BookToGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
