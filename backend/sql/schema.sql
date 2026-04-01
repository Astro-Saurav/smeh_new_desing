-- Manav Rachna Time CMS/CRM schema for Azure SQL Database

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
  CREATE TABLE users (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_users_role CHECK (role IN ('admin', 'editor'))
  );
END;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'categories')
BEGIN
  CREATE TABLE categories (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(120) NOT NULL UNIQUE,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  );
END;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'news')
BEGIN
  CREATE TABLE news (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    title NVARCHAR(300) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    category_id INT NOT NULL,
    author_id UNIQUEIDENTIFIER NOT NULL,
    image_url NVARCHAR(2048) NULL,
    status NVARCHAR(20) NOT NULL,
    published_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_news_categories FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT FK_news_users FOREIGN KEY (author_id) REFERENCES users(id),
    CONSTRAINT CK_news_status CHECK (status IN ('draft', 'published', 'scheduled'))
  );
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_news_status_published_at')
BEGIN
  CREATE INDEX IX_news_status_published_at
    ON news(status, published_at);
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_news_category_created_at')
BEGIN
  CREATE INDEX IX_news_category_created_at
    ON news(category_id, created_at DESC);
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_news_title')
BEGIN
  CREATE INDEX IX_news_title
    ON news(title);
END;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'refresh_tokens')
BEGIN
  CREATE TABLE refresh_tokens (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    token_hash NVARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    revoked_at DATETIME2 NULL,
    replaced_by_token_id UNIQUEIDENTIFIER NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_refresh_tokens_users FOREIGN KEY (user_id) REFERENCES users(id)
  );
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_refresh_tokens_user_id')
BEGIN
  CREATE INDEX IX_refresh_tokens_user_id
    ON refresh_tokens(user_id);
END;
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_refresh_tokens_expires_at')
BEGIN
  CREATE INDEX IX_refresh_tokens_expires_at
    ON refresh_tokens(expires_at);
END;
GO
