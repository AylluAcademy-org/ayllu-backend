-- CreateTable
CREATE TABLE "Rewards" (
    "reward_id" SERIAL NOT NULL,
    "courseId" INTEGER,
    "student_id" INTEGER,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "wallet" TEXT NOT NULL DEFAULT E'',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rewards_pkey" PRIMARY KEY ("reward_id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "transaction_id" SERIAL NOT NULL,
    "rewardId" INTEGER DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "Tx_id" TEXT NOT NULL DEFAULT E'',
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- AddForeignKey
ALTER TABLE "Rewards" ADD CONSTRAINT "Rewards_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rewards" ADD CONSTRAINT "Rewards_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "UsersOnCourses"("useroncourse_Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Rewards"("reward_id") ON DELETE SET NULL ON UPDATE CASCADE;
