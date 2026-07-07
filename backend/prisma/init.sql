-- PostgreSQL Bootstrap SQL
-- Runs automatically when the PostgreSQL Docker container starts for the first time
-- This enables required extensions for UUID generation

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_trgm for trigram-based text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable unaccent for accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "unaccent";
