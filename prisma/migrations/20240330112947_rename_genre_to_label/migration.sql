/*
  Warnings:

  - You are about to drop the column `genre` on the `Genres` table. All the data in the column will be lost.
  - Added the required column `label` to the `Genres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genres" DROP COLUMN "genre",
ADD COLUMN     "label" TEXT NOT NULL;
