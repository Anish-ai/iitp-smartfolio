/*
  Warnings:

  - You are about to drop the column `azureOid` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Profile_azureOid_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "azureOid";
