-- SPPLPF PostgreSQL Database Initialization
-- Configures required extensions for full-text search, trigram matching, and indexing.

CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "unaccent";
