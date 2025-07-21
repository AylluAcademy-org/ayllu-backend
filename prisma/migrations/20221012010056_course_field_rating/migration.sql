/*
  Warnings:

  - You are about to drop the column `likes` on the `Courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "likes",
ADD COLUMN     "rating" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Modules" ALTER COLUMN "class" SET DEFAULT 0,
ALTER COLUMN "time" SET DEFAULT 0;
