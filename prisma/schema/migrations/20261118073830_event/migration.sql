-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- AlterTable: Add columns with default values so existing rows are safely backfilled
ALTER TABLE "Event" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable: Remove temporary defaults so application code must supply values
ALTER TABLE "Event" ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "lat" DROP DEFAULT,
ALTER COLUMN "lng" DROP DEFAULT,
ALTER COLUMN "startsAt" DROP DEFAULT;
