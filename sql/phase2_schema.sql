-- ============================================
-- PHASE 2: CREDIBILITY & SHOWCASE
-- ============================================
-- Tables: projects, blog_posts, testimonials, github_stats
-- Purpose: Showcase technical projects, thought leadership, and social proof

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT,

    -- GitHub Integration
    github_url VARCHAR(500),
    github_repo_name VARCHAR(200),
    github_stars INTEGER DEFAULT 0,
    github_forks INTEGER DEFAULT 0,
    github_language VARCHAR(50),

    -- Project Details
    demo_url VARCHAR(500),
    image_url VARCHAR(500),
    category VARCHAR(50) NOT NULL, -- 'ml', 'data_viz', 'automation', 'web_app', 'analysis'
    tags TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',

    -- Metrics & Impact
    metrics JSONB DEFAULT '{}', -- e.g., {"accuracy": "94%", "users": "500+", "roi": "30%"}
    business_impact TEXT, -- What problem it solved, business value

    -- Display Settings
    is_featured BOOLEAN DEFAULT FALSE, -- Top 3-5 projects
    is_published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,

    -- Metadata
    project_date DATE,
    duration_months INTEGER,
    team_size INTEGER DEFAULT 1,
    role VARCHAR(100), -- 'Lead', 'Solo', 'Contributor'

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_featured ON projects(is_featured, display_order) WHERE is_published = TRUE;
CREATE INDEX idx_projects_category ON projects(category) WHERE is_published = TRUE;

-- ============================================
-- 2. BLOG POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL, -- SEO meta description
    content TEXT NOT NULL, -- Markdown or HTML

    -- SEO & Metadata
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    keywords TEXT[] DEFAULT '{}',
    cover_image_url VARCHAR(500),

    -- Categorization
    category VARCHAR(50) NOT NULL, -- 'tutorial', 'case_study', 'opinion', 'technical'
    tags TEXT[] DEFAULT '{}',
    read_time_minutes INTEGER,

    -- Engagement
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,

    -- Publishing
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_published ON blog_posts(published_at DESC) WHERE is_published = TRUE;
CREATE INDEX idx_blog_category ON blog_posts(category) WHERE is_published = TRUE;
CREATE INDEX idx_blog_featured ON blog_posts(is_featured) WHERE is_published = TRUE;

-- ============================================
-- 3. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(200) NOT NULL,
    author_title VARCHAR(200) NOT NULL,
    author_company VARCHAR(200),
    author_photo_url VARCHAR(500),
    author_linkedin_url VARCHAR(500),

    -- Testimonial Content
    quote TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 stars

    -- Context
    relationship VARCHAR(100), -- 'client', 'colleague', 'manager', 'mentor'
    project_context VARCHAR(200), -- What project/context was this for
    date_given DATE,

    -- Display Settings
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured, display_order) WHERE is_published = TRUE;

-- ============================================
-- 4. GITHUB STATS TABLE (Cache)
-- ============================================
CREATE TABLE IF NOT EXISTS github_stats (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,

    -- Profile Stats
    total_repos INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0,
    total_forks INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,

    -- Contribution Stats
    total_contributions_year INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,

    -- Language Breakdown (JSONB)
    languages JSONB DEFAULT '{}', -- e.g., {"Python": 45, "JavaScript": 30, "SQL": 25}

    -- Top Repositories (cached)
    top_repos JSONB DEFAULT '[]', -- Array of {name, stars, language, description}

    -- Cache Metadata
    last_fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_github_username ON github_stats(username);

-- ============================================
-- 5. CONTACT FORM SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    subject VARCHAR(300),
    message TEXT NOT NULL,

    -- Context
    contact_reason VARCHAR(50), -- 'freelance', 'cdi', 'collaboration', 'question'

    -- Status
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    admin_notes TEXT,

    -- Metadata
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_status ON contact_submissions(status, created_at DESC);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Projects trigger
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

-- Blog posts trigger
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_updated_at();

-- Testimonials trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW
EXECUTE FUNCTION update_testimonials_updated_at();

-- GitHub stats trigger
CREATE OR REPLACE FUNCTION update_github_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_github_stats_updated_at
BEFORE UPDATE ON github_stats
FOR EACH ROW
EXECUTE FUNCTION update_github_stats_updated_at();

-- Contact submissions trigger
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_contact_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_contact_updated_at();

COMMENT ON TABLE projects IS 'Phase 2: Top technical projects with GitHub integration and business impact metrics';
COMMENT ON TABLE blog_posts IS 'Phase 2: Technical blog articles for SEO and thought leadership';
COMMENT ON TABLE testimonials IS 'Phase 2: Social proof from clients, colleagues, and managers';
COMMENT ON TABLE github_stats IS 'Phase 2: Cached GitHub profile statistics (refreshed via cron/webhook)';
COMMENT ON TABLE contact_submissions IS 'Phase 2: Contact form submissions for freelance/CDI inquiries';
