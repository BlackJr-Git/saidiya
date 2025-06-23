-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Category" ADD VALUE 'sport';
ALTER TYPE "Category" ADD VALUE 'art';
ALTER TYPE "Category" ADD VALUE 'music';
ALTER TYPE "Category" ADD VALUE 'business';

-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "isHighlight" BOOLEAN NOT NULL DEFAULT false;
