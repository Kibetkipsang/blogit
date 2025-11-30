/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Blogs` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Blogs] DROP CONSTRAINT [Blogs_categoryId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Blogs] DROP COLUMN [categoryId];
ALTER TABLE [dbo].[Blogs] ADD [CategoryId] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_CategoryId_fkey] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories]([CategoryId]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
