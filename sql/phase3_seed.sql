-- ============================================
-- PHASE 3 SEED DATA
-- ============================================
-- Mode-specific content overrides and analytics setup

-- ============================================
-- 1. MODE CONTENT OVERRIDES
-- ============================================

-- Hero pitch overrides
INSERT INTO mode_content_overrides (mode_key, content_type, content_id, override_field, override_value, priority) VALUES
(
    'cdi',
    'hero_pitch',
    NULL,
    'hero_pitch',
    'Data Scientist Full-Stack avec 2 ans d''expérience en ML/IA et 5+ ans de background business. Je transforme des problèmes complexes en solutions data-driven concrètes. Spécialisé en Python, Machine Learning, et déploiement de modèles en production.',
    10
),
(
    'freelance',
    'hero_pitch',
    NULL,
    'hero_pitch',
    'Expert Data Science & ML disponible en freelance pour accompagner vos projets IA. Mon profil hybride Tech + Business me permet de comprendre vos enjeux métier et de livrer des solutions qui génèrent du ROI mesurable. Intervention rapide, résultats concrets.',
    10
);

-- Title overrides
INSERT INTO mode_content_overrides (mode_key, content_type, content_id, override_field, override_value, priority) VALUES
(
    'cdi',
    'title',
    NULL,
    'title',
    'Data Scientist Full-Stack • En recherche CDI',
    10
),
(
    'freelance',
    'title',
    NULL,
    'title',
    'Data Scientist Freelance • Missions ML/IA',
    10
);

-- Project 1 overrides (Churn Prediction)
INSERT INTO mode_content_overrides (mode_key, content_type, content_id, override_field, override_value, priority) VALUES
(
    'cdi',
    'project',
    1,
    'short_description',
    'Pipeline ML complet pour prédire le churn client avec 92% de précision. Démontration de mes compétences en ML engineering, feature engineering, et déploiement FastAPI.',
    5
),
(
    'freelance',
    'project',
    1,
    'short_description',
    'Solution ML qui a permis à mon client de réduire son churn de 25% et d''économiser 500K€/an. ROI prouvé en 4 mois. Intervention complète de l''analyse au déploiement.',
    5
);

-- Project 2 overrides (Dashboard)
INSERT INTO mode_content_overrides (mode_key, content_type, content_id, override_field, override_value, priority) VALUES
(
    'cdi',
    'project',
    2,
    'short_description',
    'Dashboard interactif temps réel avec Streamlit et PostgreSQL. Compétences démontrées : data viz, backend optimization, UX design pour stakeholders non-techniques.',
    5
),
(
    'freelance',
    'project',
    2,
    'short_description',
    'Dashboard qui a transformé la prise de décision de l''équipe commerciale : réduction de 80% du temps d''analyse (2h → 20min/semaine). Solution clé en main déployée en 3 mois.',
    5
);

-- Availability overrides
INSERT INTO mode_content_overrides (mode_key, content_type, content_id, override_field, override_value, priority) VALUES
(
    'cdi',
    'availability',
    NULL,
    'availability',
    'Disponible à partir d''Août 2025 pour un CDI',
    10
),
(
    'freelance',
    'availability',
    NULL,
    'availability',
    'Disponible immédiatement • TJM selon mission',
    10
);

-- ============================================
-- 2. UPDATE PROJECTS TARGET MODES
-- ============================================

-- Project 1: Churn Prediction - Both modes, higher priority for Freelance
UPDATE projects SET
    target_modes = ARRAY['cdi', 'freelance'],
    mode_priority = '{"cdi": 5, "freelance": 10}'::jsonb
WHERE id = 1;

-- Project 2: Dashboard - Both modes, balanced
UPDATE projects SET
    target_modes = ARRAY['cdi', 'freelance'],
    mode_priority = '{"cdi": 8, "freelance": 9}'::jsonb
WHERE id = 2;

-- Project 3: Portfolio Automation - More CDI-focused (shows technical skills)
UPDATE projects SET
    target_modes = ARRAY['cdi', 'freelance'],
    mode_priority = '{"cdi": 10, "freelance": 5}'::jsonb
WHERE id = 3;

-- Project 4: E-commerce Analysis - More Freelance-focused (business results)
UPDATE projects SET
    target_modes = ARRAY['cdi', 'freelance'],
    mode_priority = '{"cdi": 6, "freelance": 8}'::jsonb
WHERE id = 4;

-- Project 5: API FastAPI - CDI-focused (technical depth)
UPDATE projects SET
    target_modes = ARRAY['cdi'],
    mode_priority = '{"cdi": 9, "freelance": 0}'::jsonb
WHERE id = 5;

-- ============================================
-- 3. UPDATE BLOG TARGET MODES
-- ============================================

-- Article 1: Reconversion - Both modes
UPDATE blog_posts SET target_modes = ARRAY['cdi', 'freelance'] WHERE id = 1;

-- Article 2: ML Production - CDI-focused
UPDATE blog_posts SET target_modes = ARRAY['cdi', 'freelance'] WHERE id = 2;

-- Article 3: SQL - Both modes
UPDATE blog_posts SET target_modes = ARRAY['cdi', 'freelance'] WHERE id = 3;

-- ============================================
-- 4. EXAMPLE ANALYTICS SESSIONS (Demo data)
-- ============================================

-- Sample session 1: CDI recruiter
INSERT INTO visitor_sessions (
    id, landing_page, landing_mode, referrer_source,
    utm_source, utm_campaign,
    device_type, browser, os,
    page_views, projects_viewed, cv_downloaded,
    modes_viewed, session_duration_seconds,
    first_seen_at, last_seen_at
) VALUES (
    gen_random_uuid(),
    '/portfolio',
    'cdi',
    'linkedin',
    'linkedin',
    'job_posting_senior_ds',
    'desktop',
    'Chrome',
    'Windows 10',
    8,
    4,
    TRUE,
    ARRAY['cdi'],
    420, -- 7 minutes
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '7 minutes'
);

-- Sample session 2: Freelance client
INSERT INTO visitor_sessions (
    id, landing_page, landing_mode, referrer_source,
    utm_source, utm_campaign,
    device_type, browser, os,
    page_views, projects_viewed, contact_submitted,
    modes_viewed, mode_switches, session_duration_seconds,
    first_seen_at, last_seen_at
) VALUES (
    gen_random_uuid(),
    '/portfolio',
    'freelance',
    'google',
    'google',
    'data_scientist_freelance',
    'desktop',
    'Firefox',
    'macOS',
    12,
    5,
    TRUE,
    ARRAY['freelance', 'cdi'],
    1, -- Switched once to see CDI mode
    780, -- 13 minutes
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '13 minutes'
);

-- Sample session 3: Casual visitor (mobile)
INSERT INTO visitor_sessions (
    id, landing_page, landing_mode, referrer_source,
    device_type, browser, os,
    page_views, projects_viewed,
    modes_viewed, session_duration_seconds,
    first_seen_at, last_seen_at
) VALUES (
    gen_random_uuid(),
    '/portfolio',
    'cdi',
    'direct',
    'mobile',
    'Safari',
    'iOS',
    3,
    1,
    ARRAY['cdi'],
    90, -- 1.5 minutes
    CURRENT_TIMESTAMP - INTERVAL '3 hours',
    CURRENT_TIMESTAMP - INTERVAL '3 hours' + INTERVAL '90 seconds'
);

-- ============================================
-- 5. SAMPLE ANALYTICS EVENTS
-- ============================================

-- Example events for demo
DO $$
DECLARE
    session_id UUID;
BEGIN
    -- Get a sample session ID
    SELECT id INTO session_id FROM visitor_sessions LIMIT 1;

    IF session_id IS NOT NULL THEN
        -- Page view events
        INSERT INTO analytics_events (session_id, event_type, event_category, event_label, portfolio_mode, page_url) VALUES
        (session_id, 'page_view', 'navigation', 'Hero Section', 'cdi', '/portfolio'),
        (session_id, 'page_view', 'navigation', 'Projects Section', 'cdi', '/portfolio#projects'),
        (session_id, 'page_view', 'navigation', 'Contact Section', 'cdi', '/portfolio#contact');

        -- Engagement events
        INSERT INTO analytics_events (session_id, event_type, event_category, event_label, target_type, target_id, portfolio_mode) VALUES
        (session_id, 'click', 'engagement', 'Project Card Clicked', 'project', 1, 'cdi'),
        (session_id, 'project_view', 'engagement', 'Churn Prediction Project', 'project', 1, 'cdi');

        -- Conversion events
        INSERT INTO analytics_events (session_id, event_type, event_category, event_label, event_value, portfolio_mode) VALUES
        (session_id, 'cv_download', 'conversion', 'CV Downloaded', 1, 'cdi');
    END IF;
END $$;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Phase 3 seed data inserted successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Dual Mode Portfolio configuré:';
    RAISE NOTICE '   • Mode CDI: Focus technique, certifications, compétences';
    RAISE NOTICE '   • Mode Freelance: Focus ROI, impact business, missions';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Analytics demo data créé:';
    RAISE NOTICE '   • 3 sessions visiteurs exemples';
    RAISE NOTICE '   • Events de tracking configurés';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Content overrides configurés:';
    RAISE NOTICE '   • Hero pitch adapté par mode';
    RAISE NOTICE '   • Descriptions projets personnalisées';
    RAISE NOTICE '   • Disponibilité contextualisée';
    RAISE NOTICE '';
    RAISE NOTICE '📈 Vérifiez les vues analytics:';
    RAISE NOTICE '   SELECT * FROM mode_performance_comparison;';
    RAISE NOTICE '   SELECT * FROM analytics_daily_summary;';
END $$;
