-- DropForeignKey
ALTER TABLE "Lessons" DROP CONSTRAINT "Lessons_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Modules" DROP CONSTRAINT "Modules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ModulesOnCourse" DROP CONSTRAINT "ModulesOnCourse_module_id_fkey";

-- DropForeignKey
ALTER TABLE "ModulesOnCourse" DROP CONSTRAINT "ModulesOnCourse_userOnCourse_id_fkey";

-- DropForeignKey
ALTER TABLE "Options" DROP CONSTRAINT "Options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_testId_fkey";

-- DropForeignKey
ALTER TABLE "Resources" DROP CONSTRAINT "Resources_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswers" DROP CONSTRAINT "TestAnswers_question_id_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswers" DROP CONSTRAINT "TestAnswers_test_id_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswers" DROP CONSTRAINT "TestAnswers_userOnCourse_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnCourses" DROP CONSTRAINT "UsersOnCourses_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnCourses" DROP CONSTRAINT "UsersOnCourses_userId_fkey";

-- DropIndex
DROP INDEX "Modules_courseId_key";

-- DropIndex
DROP INDEX "Tests_moduleId_key";

-- AlterTable
ALTER TABLE "Lessons" ALTER COLUMN "moduleId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Modules" ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModulesOnCourse" ALTER COLUMN "module_id" DROP NOT NULL,
ALTER COLUMN "userOnCourse_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Options" ALTER COLUMN "questionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "testId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resources" ALTER COLUMN "lessonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TestAnswers" ALTER COLUMN "userOnCourse_id" DROP NOT NULL,
ALTER COLUMN "test_id" DROP NOT NULL,
ALTER COLUMN "question_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnCourses" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Modules" ADD CONSTRAINT "Modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lessons" ADD CONSTRAINT "Lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Modules"("module_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resources" ADD CONSTRAINT "Resources_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lessons"("lesson_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Tests"("test_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Options" ADD CONSTRAINT "Options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("question_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnCourses" ADD CONSTRAINT "UsersOnCourses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnCourses" ADD CONSTRAINT "UsersOnCourses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Courses"("course_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulesOnCourse" ADD CONSTRAINT "ModulesOnCourse_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Modules"("module_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulesOnCourse" ADD CONSTRAINT "ModulesOnCourse_userOnCourse_id_fkey" FOREIGN KEY ("userOnCourse_id") REFERENCES "UsersOnCourses"("useroncourse_Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswers" ADD CONSTRAINT "TestAnswers_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "Tests"("test_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswers" ADD CONSTRAINT "TestAnswers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("question_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswers" ADD CONSTRAINT "TestAnswers_userOnCourse_id_fkey" FOREIGN KEY ("userOnCourse_id") REFERENCES "UsersOnCourses"("useroncourse_Id") ON DELETE SET NULL ON UPDATE CASCADE;
