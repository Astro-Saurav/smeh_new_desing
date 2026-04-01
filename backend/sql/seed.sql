-- Seed categories
IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Campus Buzz')
  INSERT INTO categories (name) VALUES ('Campus Buzz');

IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Blog')
  INSERT INTO categories (name) VALUES ('Blog');

IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Achievements')
  INSERT INTO categories (name) VALUES ('Achievements');

IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Current Affairs')
  INSERT INTO categories (name) VALUES ('Current Affairs');

IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Social Buzz')
  INSERT INTO categories (name) VALUES ('Social Buzz');

IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Beyond Campus')
  INSERT INTO categories (name) VALUES ('Beyond Campus');

-- Create admin user (replace hash with a generated bcrypt hash)
-- Example placeholder hash is for password: ChangeMeNow123!
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@manavrachna.edu')
  INSERT INTO users (id, email, password_hash, role)
  VALUES (NEWID(), 'admin@manavrachna.edu', '$2b$12$2SnfslksYrjztTv4IqfW2O6r5Dc2zHG7mYybK1fD8Bf4Y8VnGmA/K', 'admin');
