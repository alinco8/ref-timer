-- CreateTable
CREATE TABLE "Reservation" (
    "date" TIMESTAMP(3) NOT NULL,
    "number" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("number")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_date_key" ON "Reservation"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_number_key" ON "Reservation"("number");
