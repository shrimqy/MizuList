/*
  Warnings:

  - You are about to drop the column `label` on the `Genres` table. All the data in the column will be lost.
  - Added the required column `genre` to the `Genres` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genres" DROP COLUMN "label",
ADD COLUMN     "genre" TEXT NOT NULL;
