-- AI Opportunity Finder Database Schema
-- Based on PRD v1.0 Section 10.3

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  oauth_provider  TEXT,
  provider_id     TEXT,
  name            TEXT,
  skills_json     JSONB,
  budget_usd      INTEGER,
  created_at      TIMESTAMP DEFAULT now()
);

-- Opportunities main table
CREATE TABLE IF NOT EXISTS opportunities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT,
  vector_id       UUID,        -- pgvector row or Qdrant payload key
  pain_score      REAL DEFAULT 0,
  tam_score       REAL DEFAULT 0,
  gap_score       REAL DEFAULT 0,
  ai_fit_score    REAL DEFAULT 0,
  solo_fit_score  REAL DEFAULT 0,
  risk_score      REAL DEFAULT 0,
  total_score     REAL DEFAULT 0,
  detected_at     TIMESTAMP DEFAULT now(),
  updated_at      TIMESTAMP DEFAULT now(),
  embedding       VECTOR(1536)  -- OpenAI text-embedding-3-small dimensions
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_op_total ON opportunities(total_score DESC, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_op_embedding ON opportunities USING ivfflat (embedding vector_cosine_ops);

-- Data sources for each opportunity
CREATE TABLE IF NOT EXISTS opportunity_sources (
  id              BIGSERIAL PRIMARY KEY,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  source_type     TEXT NOT NULL,          -- reddit | g2 | linkedin | hackernews etc.
  source_url      TEXT,
  raw_json        JSONB,
  created_at      TIMESTAMP DEFAULT now()
);

-- User interactions with opportunities
CREATE TABLE IF NOT EXISTS user_opportunity_actions (
  id              BIGSERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  action          TEXT NOT NULL, -- favorite | dismiss | purchase | feedback
  value           JSONB,
  created_at      TIMESTAMP DEFAULT now()
);

-- Purchase transactions
CREATE TABLE IF NOT EXISTS purchases (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id   UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  price_usd        NUMERIC(10,2) NOT NULL,
  stripe_pi        TEXT,
  status           TEXT DEFAULT 'pending',
  report_url       TEXT,
  purchased_at     TIMESTAMP DEFAULT now()
);

-- Quick-Start Kits metadata
CREATE TABLE IF NOT EXISTS quick_start_kits (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id   UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  kit_type         TEXT NOT NULL, -- boilerplate | nocode | prd
  s3_url           TEXT,
  generated_at     TIMESTAMP DEFAULT now()
);

-- Create partitioned table for opportunities by month (for scalability)
-- This would be implemented later as data grows

-- Insert sample admin user for testing
INSERT INTO users (id, email, name, oauth_provider) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@deepneed.com',
  'Admin User',
  'github'
) ON CONFLICT (email) DO NOTHING;

-- Sample opportunity for testing
INSERT INTO opportunities (
  id,
  title,
  description,
  pain_score,
  tam_score,
  gap_score,
  ai_fit_score,
  solo_fit_score,
  risk_score,
  total_score
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'AI-Powered Email Newsletter Summarizer',
  'Many professionals are overwhelmed by newsletter subscriptions. An AI tool that automatically summarizes key insights from newsletters could save hours per week.',
  8.5,
  7.2,
  6.8,
  9.1,
  8.7,
  3.2,
  7.58
) ON CONFLICT (id) DO NOTHING;

-- Sample source data
INSERT INTO opportunity_sources (opportunity_id, source_type, source_url, raw_json)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'reddit',
  'https://reddit.com/r/productivity/comments/example',
  '{"title": "I spend 2 hours daily reading newsletters", "upvotes": 234, "comments": 67}'
) ON CONFLICT DO NOTHING;