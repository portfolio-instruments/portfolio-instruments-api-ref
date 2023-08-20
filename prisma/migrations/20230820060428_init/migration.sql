-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AssetCode" AS ENUM ('CASH', 'BILLS', 'STB', 'ITB', 'LTB', 'COMMODITIES', 'GOLD', 'REITS', 'TSM', 'DLCB', 'DLCG', 'DLCV', 'DMCB', 'DMCG', 'DMCV', 'DSCG', 'DSCB', 'DSCV', 'ILCB', 'ILCG', 'ILCV', 'IMCB', 'IMCG', 'IMCV', 'ISCB', 'ISCG', 'ISCV', 'OTHER');

-- CreateEnum
CREATE TYPE "TaxShelter" AS ENUM ('TAXABLE', 'TRADITIONAL', 'ROTH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "defaultBenchmarkId" INTEGER,
    "vpThresholdPercent" INTEGER NOT NULL DEFAULT 10,
    "rebalanceThresholdPercent" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "title" VARCHAR(150) NOT NULL,
    "shortDescription" VARCHAR(255),
    "longDescription" TEXT,
    "url" VARCHAR(255),
    "stdDevPercent" DOUBLE PRECISION,
    "cagrPercent" DOUBLE PRECISION,
    "worstDrawdownPercent" DOUBLE PRECISION,
    "longestDrawdownYears" DOUBLE PRECISION,
    "assets" "AssetCode"[],
    "assetsPercent" INTEGER[],
    "assetsViewHexColors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "taxShelter" "TaxShelter" NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_defaultBenchmarkId_key" ON "Settings"("defaultBenchmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_userId_key" ON "Benchmark"("userId");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benchmark" ADD CONSTRAINT "Benchmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
