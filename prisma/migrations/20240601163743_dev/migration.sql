/*
  Warnings:

  - The `keep` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uuid]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reservation_date_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "keep",
ADD COLUMN     "keep" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_uuid_key" ON "Reservation"("uuid");
