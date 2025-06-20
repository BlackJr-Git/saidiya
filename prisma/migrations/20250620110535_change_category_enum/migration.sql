/*
  Warnings:

  - You are about to drop the column `categorie` on the `campaign` table. All the data in the column will be lost.
  - Added the required column `category` to the `campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'culture';
ALTER TYPE "Category" ADD VALUE 'tech';
ALTER TYPE "Category" ADD VALUE 'community';
ALTER TYPE "Category" ADD VALUE 'other';

-- AlterTable
ALTER TABLE "campaign" DROP COLUMN "categorie",
ADD COLUMN     "category" "Category" NOT NULL;
