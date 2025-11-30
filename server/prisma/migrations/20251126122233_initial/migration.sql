BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [UserId] NVARCHAR(1000) NOT NULL,
    [FirstName] NVARCHAR(1000) NOT NULL,
    [LastName] NVARCHAR(1000) NOT NULL,
    [UserName] NVARCHAR(1000) NOT NULL,
    [EmailAdress] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [Role] NVARCHAR(1000) NOT NULL CONSTRAINT [Users_Role_df] DEFAULT 'user',
    [IsDeleted] BIT NOT NULL CONSTRAINT [Users_IsDeleted_df] DEFAULT 0,
    [DateJoined] DATETIME2 NOT NULL CONSTRAINT [Users_DateJoined_df] DEFAULT CURRENT_TIMESTAMP,
    [LastUpdated] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([UserId]),
    CONSTRAINT [Users_UserName_key] UNIQUE NONCLUSTERED ([UserName]),
    CONSTRAINT [Users_EmailAdress_key] UNIQUE NONCLUSTERED ([EmailAdress])
);

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
    [CategoryId] NVARCHAR(1000),
    CONSTRAINT [Blogs_pkey] PRIMARY KEY CLUSTERED ([PostId])
);

-- CreateTable
CREATE TABLE [dbo].[Categories] (
    [CategoryId] NVARCHAR(1000) NOT NULL,
    [Name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Categories_pkey] PRIMARY KEY CLUSTERED ([CategoryId]),
    CONSTRAINT [Categories_Name_key] UNIQUE NONCLUSTERED ([Name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
