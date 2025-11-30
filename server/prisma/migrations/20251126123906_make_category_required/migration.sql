/*
  Warnings:

  - You are about to drop the column `CategoryId` on the `Blogs` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Blogs` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Blogs] DROP CONSTRAINT [Blogs_CategoryId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Blogs] DROP COLUMN [CategoryId];
ALTER TABLE [dbo].[Blogs] ADD [categoryId] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Categories]([CategoryId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
