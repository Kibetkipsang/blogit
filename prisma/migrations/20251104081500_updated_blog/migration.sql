/*
  Warnings:

  - You are about to drop the `Posts` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Posts] DROP CONSTRAINT [Posts_UserId_fkey];

-- DropTable
DROP TABLE [dbo].[Posts];

-- CreateTable
CREATE TABLE [dbo].[Blogs] (
    [PostId] NVARCHAR(1000) NOT NULL,
    [Title] NVARCHAR(1000) NOT NULL,
    [Synopsis] NVARCHAR(1000) NOT NULL,
    [FeaturedImageUrl] NVARCHAR(1000) NOT NULL,
    [Content] NVARCHAR(1000) NOT NULL,
    [IsDeleted] BIT NOT NULL CONSTRAINT [Blogs_IsDeleted_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Blogs_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [LastUpdated] DATETIME2 NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Blogs_pkey] PRIMARY KEY CLUSTERED ([PostId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
