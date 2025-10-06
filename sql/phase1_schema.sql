-- Phase 1: MVP Portfolio - New Tables
-- Tables for personal profile and career timeline

-- Profile table (single row with personal information)
CREATE TABLE IF NOT EXISTS profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  bio TEXT,
  hero_pitch TEXT NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  kaggle_url VARCHAR(500),
  photo_url VARCHAR(500),
  location VARCHAR(200),
  availability VARCHAR(100), -- e.g., "Disponible à partir d'Août 2025"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Timeline events (career milestones)
CREATE TABLE IF NOT EXISTS timeline_events (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  end_date DATE, -- For periods (optional)
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'commercial', 'formation', 'alternance', 'certification', 'project'
  icon VARCHAR(50), -- Icon name for frontend (e.g., 'briefcase', 'graduation', 'code')
  metrics JSONB, -- Flexible metrics: {"projects": 12, "hours": 1500, "certifications": 5}
  tags TEXT[], -- Related technologies or keywords
  link_url VARCHAR(500), -- Optional link (certificate, project, etc.)
  display_order INTEGER DEFAULT 0, -- For manual ordering
  is_highlight BOOLEAN DEFAULT FALSE, -- Highlight important milestones
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_timeline_events_date ON timeline_events(date);
CREATE INDEX IF NOT EXISTS idx_timeline_events_category ON timeline_events(category);

-- Skills table (for structured skills management)
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'technical', 'business', 'soft', 'tools'
  subcategory VARCHAR(100), -- 'machine-learning', 'data-engineering', 'cloud', 'communication'
  proficiency_level INTEGER CHECK (proficiency_level BETWEEN 1 AND 5), -- 1=Beginner, 5=Expert
  years_experience FLOAT,
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE, -- Highlight primary skills
  icon VARCHAR(50), -- Icon name for frontend
  created_at TIMESTAMP DEFAULT NOW()
);

-- Social links table (flexible for multiple platforms)
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL, -- 'linkedin', 'github', 'twitter', 'medium', 'kaggle'
  url VARCHAR(500) NOT NULL,
  display_name VARCHAR(100),
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger for updating updated_at on profile
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_updated_at_trigger
    BEFORE UPDATE ON profile
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_updated_at();

-- View for timeline with computed properties
CREATE OR REPLACE VIEW timeline_summary AS
SELECT
    t.*,
    CASE
        WHEN end_date IS NOT NULL THEN
            CONCAT(TO_CHAR(date, 'Mon YYYY'), ' - ', TO_CHAR(end_date, 'Mon YYYY'))
        ELSE
            TO_CHAR(date, 'Mon YYYY')
    END as period_label,
    CASE
        WHEN end_date IS NOT NULL THEN
            EXTRACT(YEAR FROM AGE(end_date, date)) * 12 +
            EXTRACT(MONTH FROM AGE(end_date, date))
        ELSE 0
    END as duration_months
FROM timeline_events
ORDER BY date ASC, display_order ASC;
