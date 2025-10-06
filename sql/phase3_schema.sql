-- ============================================
-- PHASE 3: DUAL MODE (CDI vs FREELANCE) + ADVANCED
-- ============================================
-- Tables: portfolio_modes, mode_content_overrides, analytics_events, visitor_sessions
-- Purpose: Support dual-mode portfolio (recruiter vs client) with analytics

-- ============================================
-- 1. PORTFOLIO MODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_modes (
    id SERIAL PRIMARY KEY,
    mode_key VARCHAR(50) UNIQUE NOT NULL, -- 'cdi' or 'freelance'
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color_primary VARCHAR(20), -- e.g., 'blue' for CDI, 'purple' for Freelance
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    -- Mode-specific settings
    settings JSONB DEFAULT '{}', -- Custom settings per mode

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default modes
INSERT INTO portfolio_modes (mode_key, display_name, description, icon, color_primary, is_default, settings) VALUES
('cdi', 'Mode CDI', 'Portfolio orienté recrutement en entreprise', '💼', 'blue', TRUE, '{"focus": "technical_skills", "show_salary": false, "highlight_certifications": true}'),
('freelance', 'Mode Freelance', 'Portfolio orienté missions et clients', '🚀', 'purple', FALSE, '{"focus": "business_impact", "show_rates": true, "highlight_case_studies": true}')
ON CONFLICT (mode_key) DO NOTHING;

-- ============================================
-- 2. MODE CONTENT OVERRIDES TABLE
-- ============================================
-- Allows customizing content per mode (hero pitch, project descriptions, etc.)
CREATE TABLE IF NOT EXISTS mode_content_overrides (
    id SERIAL PRIMARY KEY,
    mode_key VARCHAR(50) NOT NULL REFERENCES portfolio_modes(mode_key) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'hero_pitch', 'project_description', 'bio', etc.
    content_id INTEGER, -- ID of the content (e.g., project_id, NULL for global like hero)
    override_field VARCHAR(100) NOT NULL, -- Field to override (e.g., 'short_description', 'title')
    override_value TEXT NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0, -- Higher priority wins if multiple overrides

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(mode_key, content_type, content_id, override_field)
);

CREATE INDEX idx_mode_overrides_lookup ON mode_content_overrides(mode_key, content_type, content_id) WHERE is_active = TRUE;

-- ============================================
-- 3. ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL, -- Links to visitor_sessions

    -- Event details
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'click', 'project_view', 'contact_submit', etc.
    event_category VARCHAR(50), -- 'navigation', 'engagement', 'conversion'
    event_label VARCHAR(200), -- Descriptive label
    event_value INTEGER, -- Optional numeric value

    -- Context
    portfolio_mode VARCHAR(50), -- 'cdi', 'freelance', or NULL
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),

    -- Target (what was interacted with)
    target_type VARCHAR(50), -- 'project', 'blog_post', 'button', etc.
    target_id INTEGER, -- ID of the target entity

    -- Metadata
    metadata JSONB DEFAULT '{}', -- Additional data (scroll depth, time on page, etc.)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_session ON analytics_events(session_id, created_at DESC);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type, created_at DESC);
CREATE INDEX idx_analytics_events_mode ON analytics_events(portfolio_mode, created_at DESC);

-- ============================================
-- 4. VISITOR SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visitor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Session info
    first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_duration_seconds INTEGER DEFAULT 0,

    -- Initial context
    landing_page VARCHAR(500),
    landing_mode VARCHAR(50), -- Which mode they landed in
    referrer_source VARCHAR(200), -- 'google', 'linkedin', 'direct', etc.
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),

    -- Device & browser
    user_agent TEXT,
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(50),

    -- Location (optional)
    ip_address VARCHAR(50),
    country_code VARCHAR(10),
    city VARCHAR(100),

    -- Engagement metrics
    page_views INTEGER DEFAULT 1,
    projects_viewed INTEGER DEFAULT 0,
    blog_posts_viewed INTEGER DEFAULT 0,
    contact_submitted BOOLEAN DEFAULT FALSE,
    cv_downloaded BOOLEAN DEFAULT FALSE,

    -- Mode switching
    mode_switches INTEGER DEFAULT 0, -- How many times they toggled mode
    modes_viewed TEXT[], -- Array of modes visited

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitor_sessions_landing_mode ON visitor_sessions(landing_mode, created_at DESC);
CREATE INDEX idx_visitor_sessions_referrer ON visitor_sessions(referrer_source, created_at DESC);
CREATE INDEX idx_visitor_sessions_updated ON visitor_sessions(updated_at DESC);

-- ============================================
-- 5. MODE-SPECIFIC PROJECT TAGS
-- ============================================
-- Extend projects table to support mode filtering
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_modes TEXT[] DEFAULT ARRAY['cdi', 'freelance'];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mode_priority JSONB DEFAULT '{"cdi": 0, "freelance": 0}';

COMMENT ON COLUMN projects.target_modes IS 'Which modes should display this project (cdi, freelance, or both)';
COMMENT ON COLUMN projects.mode_priority IS 'Display priority per mode (higher = shown first)';

-- ============================================
-- 6. MODE-SPECIFIC BLOG TAGS
-- ============================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS target_modes TEXT[] DEFAULT ARRAY['cdi', 'freelance'];

-- ============================================
-- 7. CONVERSION GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversion_goals (
    id SERIAL PRIMARY KEY,
    goal_name VARCHAR(100) UNIQUE NOT NULL,
    goal_type VARCHAR(50) NOT NULL, -- 'contact', 'cv_download', 'project_view', 'time_on_site'
    target_value NUMERIC, -- e.g., 5 for "5 projects viewed"

    -- Mode-specific
    mode_key VARCHAR(50) REFERENCES portfolio_modes(mode_key),

    -- Tracking
    total_completions INTEGER DEFAULT 0,
    completions_this_month INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default goals
INSERT INTO conversion_goals (goal_name, goal_type, mode_key, target_value) VALUES
('CDI - Contact Form Submission', 'contact', 'cdi', 1),
('CDI - CV Download', 'cv_download', 'cdi', 1),
('CDI - 3+ Projects Viewed', 'project_view', 'cdi', 3),
('Freelance - Contact Form Submission', 'contact', 'freelance', 1),
('Freelance - 2+ Projects Viewed', 'project_view', 'freelance', 2),
('Freelance - 5+ Minutes on Site', 'time_on_site', 'freelance', 300)
ON CONFLICT (goal_name) DO NOTHING;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Portfolio modes trigger
CREATE OR REPLACE FUNCTION update_portfolio_modes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_portfolio_modes_updated_at
BEFORE UPDATE ON portfolio_modes
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_modes_updated_at();

-- Mode content overrides trigger
CREATE OR REPLACE FUNCTION update_mode_content_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mode_content_overrides_updated_at
BEFORE UPDATE ON mode_content_overrides
FOR EACH ROW
EXECUTE FUNCTION update_mode_content_overrides_updated_at();

-- Visitor sessions trigger
CREATE OR REPLACE FUNCTION update_visitor_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.session_duration_seconds = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - NEW.first_seen_at))::INTEGER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_visitor_sessions_updated_at
BEFORE UPDATE ON visitor_sessions
FOR EACH ROW
EXECUTE FUNCTION update_visitor_sessions_updated_at();

-- Conversion goals trigger
CREATE OR REPLACE FUNCTION update_conversion_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_conversion_goals_updated_at
BEFORE UPDATE ON conversion_goals
FOR EACH ROW
EXECUTE FUNCTION update_conversion_goals_updated_at();

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- View: Daily analytics summary
CREATE OR REPLACE VIEW analytics_daily_summary AS
SELECT
    DATE(created_at) as date,
    portfolio_mode,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
GROUP BY DATE(created_at), portfolio_mode, event_type
ORDER BY date DESC, event_count DESC;

-- View: Mode comparison
CREATE OR REPLACE VIEW mode_performance_comparison AS
SELECT
    landing_mode,
    COUNT(*) as total_sessions,
    AVG(session_duration_seconds) as avg_duration_seconds,
    AVG(page_views) as avg_page_views,
    SUM(CASE WHEN contact_submitted THEN 1 ELSE 0 END) as total_contacts,
    SUM(CASE WHEN cv_downloaded THEN 1 ELSE 0 END) as total_cv_downloads,
    ROUND(100.0 * SUM(CASE WHEN contact_submitted THEN 1 ELSE 0 END) / COUNT(*), 2) as contact_conversion_rate
FROM visitor_sessions
WHERE landing_mode IS NOT NULL
GROUP BY landing_mode;

COMMENT ON TABLE portfolio_modes IS 'Phase 3: Portfolio modes (CDI vs Freelance)';
COMMENT ON TABLE mode_content_overrides IS 'Phase 3: Mode-specific content customization';
COMMENT ON TABLE analytics_events IS 'Phase 3: User interaction tracking for analytics';
COMMENT ON TABLE visitor_sessions IS 'Phase 3: Visitor session tracking and attribution';
COMMENT ON TABLE conversion_goals IS 'Phase 3: Conversion goal definitions and tracking';
