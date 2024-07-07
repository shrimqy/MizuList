/*
  Warnings:

  - You are about to drop the `_userLikes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userdisLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_userLikes" DROP CONSTRAINT "_userLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_userLikes" DROP CONSTRAINT "_userLikes_B_fkey";

-- DropForeignKey
ALTER TABLE "_userdisLikes" DROP CONSTRAINT "_userdisLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_userdisLikes" DROP CONSTRAINT "_userdisLikes_B_fkey";

-- DropTable
DROP TABLE "_userLikes";

-- DropTable
DROP TABLE "_userdisLikes";

-- CreateTable
CREATE TABLE "_UserLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserDislikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikes_AB_unique" ON "_UserLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikes_B_index" ON "_UserLikes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDislikes_AB_unique" ON "_UserDislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDislikes_B_index" ON "_UserDislikes"("B");

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Like"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDislikes" ADD CONSTRAINT "_UserDislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Dislike"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserDislikes" ADD CONSTRAINT "_UserDislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
