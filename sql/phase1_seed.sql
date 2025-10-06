-- Phase 1: MVP Portfolio - Seed Data
-- IMPORTANT: Remplacez les valeurs template par vos vraies informations !

-- Insert profile (single row)
INSERT INTO profile (
    full_name,
    title,
    bio,
    hero_pitch,
    email,
    linkedin_url,
    github_url,
    kaggle_url,
    location,
    availability
) VALUES (
    'Raouf Addeche', -- TODO: Remplacer par votre nom complet
    'Data Scientist en Alternance',
    'Ex-Commercial passionné par l''IA et la Data Science. En reconversion depuis 2 ans, je combine compétences techniques (ML/DL, Python, Cloud) et expertise business (communication, analyse ROI, vulgarisation) pour transformer des problèmes métier en solutions IA concrètes.',
    'Je transforme des problèmes business en solutions IA concrètes. Mon parcours commercial me permet de comprendre vos besoins métier et de les traduire en modèles performants.',
    'raouf.addeche@example.com', -- TODO: Remplacer par votre email
    'https://www.linkedin.com/in/votre-profil', -- TODO: Remplacer
    'https://github.com/votre-username', -- TODO: Remplacer
    'https://www.kaggle.com/votre-username', -- TODO: Remplacer ou NULL
    'Paris, France', -- TODO: Remplacer
    'Disponible à partir d''Août 2025 (fin d''alternance)'
) ON CONFLICT (id) DO NOTHING;

-- Insert timeline events
INSERT INTO timeline_events (date, end_date, title, description, category, icon, metrics, tags, is_highlight, display_order) VALUES

-- Phase Commercial (2017-2022)
('2017-01-01', '2022-12-31', 'Commercial B2B',
 'Expérience de 5+ ans dans la vente de solutions B2B. Développement de compétences en négociation, relation client, analyse de besoins et closing.',
 'commercial', 'briefcase',
 '{"clients": "50+", "revenue": "1M€+", "satisfaction": "95%"}',
 ARRAY['Vente', 'Négociation', 'Relation Client', 'CRM'],
 true, 1),

-- Décision de reconversion
('2022-06-01', NULL, 'Décision de Reconversion',
 'Prise de conscience : passion pour la tech et volonté de créer un impact plus direct avec la data et l''IA.',
 'formation', 'lightbulb',
 NULL,
 ARRAY['Reconversion', 'Motivation'],
 false, 2),

-- Formation intensive (2023)
('2023-01-01', '2023-12-31', 'Formation Intensive Data Science',
 'Formation accélérée en Data Science et Machine Learning : Python, SQL, statistiques, ML/DL, MLOps, Cloud.',
 'formation', 'graduation',
 '{"hours": 1500, "projects": 12, "certifications": 3}',
 ARRAY['Python', 'Machine Learning', 'SQL', 'Deep Learning'],
 true, 3),

-- Certifications (exemples - à adapter)
('2023-03-15', NULL, 'Certification Python Data Science',
 'Certification en programmation Python pour la Data Science (Pandas, NumPy, Scikit-learn).',
 'certification', 'award',
 '{"score": "95%"}',
 ARRAY['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
 false, 4),

('2023-06-20', NULL, 'Certification Machine Learning',
 'Certification en Machine Learning : algorithmes supervisés, non-supervisés, feature engineering.',
 'certification', 'award',
 '{"score": "92%"}',
 ARRAY['Machine Learning', 'Scikit-learn', 'TensorFlow'],
 false, 5),

-- Projet de fin de formation (exemple)
('2023-11-01', '2023-12-20', 'Projet de Fin de Formation',
 'Développement d''un système de prédiction avec ML : de l''analyse exploratoire au déploiement (FastAPI + Docker).',
 'project', 'code',
 '{"accuracy": "89%", "deployment": "Docker", "api": "FastAPI"}',
 ARRAY['Python', 'Scikit-learn', 'FastAPI', 'Docker'],
 true, 6),

-- Alternance (2024-2025)
('2024-09-01', '2025-08-31', 'Data Scientist en Alternance',
 'Alternance au sein d''une équipe Data Science : développement de modèles ML en production, automatisation de pipelines ETL, reporting et visualisation.',
 'alternance', 'code',
 '{"models_deployed": 3, "pipelines": 5, "team_size": 6}',
 ARRAY['Python', 'Scikit-learn', 'Pandas', 'SQL', 'Docker', 'Git', 'Airflow'],
 true, 7),

-- Certification en cours (exemple)
('2025-01-15', NULL, 'AWS ML Specialty (en cours)',
 'Préparation de la certification AWS Certified Machine Learning - Specialty. Objectif : maîtriser le déploiement de modèles ML sur AWS.',
 'certification', 'award',
 '{"progress": 60}',
 ARRAY['AWS', 'SageMaker', 'Cloud', 'MLOps'],
 false, 8);

-- Insert skills (technical)
INSERT INTO skills (name, category, subcategory, proficiency_level, years_experience, is_primary) VALUES
-- Machine Learning
('Python', 'technical', 'machine-learning', 4, 2, true),
('Scikit-learn', 'technical', 'machine-learning', 4, 2, true),
('TensorFlow', 'technical', 'machine-learning', 3, 1.5, false),
('PyTorch', 'technical', 'machine-learning', 3, 1, false),
('XGBoost', 'technical', 'machine-learning', 4, 1.5, false),
('Feature Engineering', 'technical', 'machine-learning', 4, 2, true),

-- Data Engineering
('SQL', 'technical', 'data-engineering', 4, 2, true),
('Pandas', 'technical', 'data-engineering', 4, 2, true),
('NumPy', 'technical', 'data-engineering', 4, 2, false),
('Apache Airflow', 'technical', 'data-engineering', 3, 1, false),
('ETL/ELT', 'technical', 'data-engineering', 3, 1, false),

-- Cloud & MLOps
('Docker', 'technical', 'mlops', 3, 1.5, false),
('Git', 'technical', 'mlops', 4, 2, true),
('FastAPI', 'technical', 'mlops', 4, 1.5, false),
('MLflow', 'technical', 'mlops', 3, 1, false),
('AWS', 'technical', 'cloud', 2, 0.5, false),

-- Visualization
('Streamlit', 'technical', 'visualization', 4, 1.5, false),
('Plotly', 'technical', 'visualization', 3, 1, false),
('Tableau', 'technical', 'visualization', 3, 1, false),

-- Business Skills
('Vulgarisation Technique', 'business', 'communication', 5, 7, true),
('Analyse ROI', 'business', 'business-analysis', 4, 5, true),
('Compréhension Métier', 'business', 'business-analysis', 5, 7, true),
('Présentation Client', 'business', 'communication', 5, 5, true),
('Négociation', 'business', 'soft-skills', 4, 5, false);

-- Insert social links
INSERT INTO social_links (platform, url, display_name, icon, display_order) VALUES
('linkedin', 'https://www.linkedin.com/in/votre-profil', 'LinkedIn', 'linkedin', 1),
('github', 'https://github.com/votre-username', 'GitHub', 'github', 2),
('kaggle', 'https://www.kaggle.com/votre-username', 'Kaggle', 'kaggle', 3),
('email', 'mailto:raouf.addeche@example.com', 'Email', 'mail', 4);

-- Verify data
SELECT 'Profile inserted' as status, COUNT(*) as count FROM profile
UNION ALL
SELECT 'Timeline events inserted', COUNT(*) FROM timeline_events
UNION ALL
SELECT 'Skills inserted', COUNT(*) FROM skills
UNION ALL
SELECT 'Social links inserted', COUNT(*) FROM social_links;
