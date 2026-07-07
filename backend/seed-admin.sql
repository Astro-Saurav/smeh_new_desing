-- Create Admin and Editor roles
INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles (name) VALUES ('editor') ON CONFLICT (name) DO NOTHING;

-- Create Admin user
-- Email: admin@mrt.edu.in
-- Password: Admin@123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, role_id, is_2fa_enabled, updated_at)
SELECT 'admin@mrt.edu.in', 
       '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86AGR0Nt4Em', 
       id, 
       false,
       NOW()
FROM roles WHERE name = 'admin'
ON CONFLICT (email) DO NOTHING;

-- Create Editor user
-- Email: editor@mrt.edu.in
-- Password: Editor@123 (hashed with bcrypt)
INSERT INTO users (email, password_hash, role_id, is_2fa_enabled, updated_at)
SELECT 'editor@mrt.edu.in', 
       '$2b$12$7hJKYXLzR3VzYYEt4K/u/OQYY1g7z5pXt0Q1V6B8M9c9K7X7B3b8u', 
       id, 
       false,
       NOW()
FROM roles WHERE name = 'editor'
ON CONFLICT (email) DO NOTHING;

-- Create sample category
INSERT INTO categories (name, slug, updated_at) VALUES ('Campus News', 'campus-news', NOW()) 
ON CONFLICT (slug) DO NOTHING;

-- Verify data was inserted
SELECT 'Users created:' as info;
SELECT email, role_id FROM users WHERE email IN ('admin@mrt.edu.in', 'editor@mrt.edu.in');

SELECT 'Roles created:' as info;
SELECT name FROM roles ORDER BY name;

SELECT 'Categories created:' as info;
SELECT name, slug FROM categories LIMIT 1;
