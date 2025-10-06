-- ============================================
-- PHASE 2 SEED DATA
-- ============================================
-- IMPORTANT: Personnalisez ces données avec vos vrais projets, articles, et témoignages
-- Ce fichier contient des exemples template pour démarrer

-- ============================================
-- 1. PROJECTS (Top 3-5 featured projects)
-- ============================================

-- Project 1: ML Model for Business Prediction
INSERT INTO projects (
    title, slug, short_description, long_description,
    github_url, github_repo_name, github_language,
    category, tags, technologies,
    metrics, business_impact,
    is_featured, is_published, display_order,
    project_date, duration_months, team_size, role
) VALUES (
    'Prédiction de Churn Client avec ML',
    'churn-prediction-ml',
    'Modèle de Machine Learning pour prédire le désabonnement client avec 92% de précision',
    'Développement d''un pipeline complet de Machine Learning pour identifier les clients à risque de churn. Le modèle utilise des algorithmes d''ensemble (Random Forest + XGBoost) et analyse 50+ features comportementales. L''API REST permet l''intégration avec les outils CRM existants.',
    'https://github.com/votre-username/churn-prediction',
    'churn-prediction',
    'Python',
    'ml',
    ARRAY['Machine Learning', 'Data Science', 'Business Impact'],
    ARRAY['Python', 'Scikit-learn', 'XGBoost', 'FastAPI', 'Docker'],
    '{"accuracy": "92%", "clients_saved": "150+", "roi": "+25%", "api_uptime": "99.8%"}',
    'Réduction de 25% du taux de churn en permettant des interventions proactives sur les clients à risque. Économie estimée de 500K€/an pour l''entreprise.',
    TRUE, -- featured
    TRUE, -- published
    1, -- display order
    '2024-06-01',
    4, -- 4 months
    1, -- solo
    'Lead Developer'
);

-- Project 2: Data Visualization Dashboard
INSERT INTO projects (
    title, slug, short_description, long_description,
    github_url, github_repo_name, github_language,
    category, tags, technologies,
    metrics, business_impact,
    is_featured, is_published, display_order,
    project_date, duration_months, team_size, role
) VALUES (
    'Dashboard Analytics Temps Réel',
    'realtime-analytics-dashboard',
    'Dashboard interactif pour visualiser les KPIs business en temps réel avec Python et Streamlit',
    'Dashboard full-stack permettant aux managers de suivre les métriques business critiques en temps réel. Intégration avec PostgreSQL, calculs automatisés, et alertes configurables. Interface intuitive développée avec Streamlit.',
    'https://github.com/votre-username/analytics-dashboard',
    'analytics-dashboard',
    'Python',
    'data_viz',
    ARRAY['Data Visualization', 'Business Intelligence', 'Dashboards'],
    ARRAY['Python', 'Streamlit', 'Plotly', 'PostgreSQL', 'Pandas'],
    '{"users": "50+", "dashboards": "12", "refresh_rate": "real-time", "uptime": "99.5%"}',
    'Permet aux équipes commerciales de prendre des décisions data-driven en temps réel. Réduit le temps d''analyse de 80% (de 2h à 20 minutes par semaine).',
    TRUE, -- featured
    TRUE,
    2,
    '2024-03-01',
    3,
    2,
    'Co-Lead'
);

-- Project 3: Automation Tool with n8n
INSERT INTO projects (
    title, slug, short_description, long_description,
    github_url, github_repo_name, github_language,
    demo_url,
    category, tags, technologies,
    metrics, business_impact,
    is_featured, is_published, display_order,
    project_date, duration_months, team_size, role
) VALUES (
    'Automatisation Portfolio avec n8n + AI',
    'automated-portfolio-n8n',
    'Système d''automatisation intelligent pour gérer un portfolio professionnel via workflows n8n et LLMs',
    'Architecture complète d''automatisation utilisant n8n pour orchestrer les workflows, Ollama pour l''analyse IA locale, et PostgreSQL pour le stockage. Le système scanne automatiquement GitHub, génère des résumés de projets avec des LLMs, et met à jour le portfolio avec validation humaine.',
    'https://github.com/votre-username/portfolio-automation',
    'portfolio-automation',
    'Python',
    'https://votre-portfolio.com',
    'automation',
    ARRAY['Automation', 'AI/ML', 'Full Stack'],
    ARRAY['n8n', 'Docker', 'PostgreSQL', 'Ollama', 'FastAPI', 'React'],
    '{"workflows": "5+", "automation_rate": "90%", "time_saved": "10h/week"}',
    'Réduit le temps de maintenance du portfolio de 10h/semaine à 1h. Le système permet de garder le portfolio toujours à jour automatiquement.',
    TRUE, -- featured
    TRUE,
    3,
    '2025-01-01',
    2,
    1,
    'Solo Creator'
);

-- Project 4: SQL Analysis for E-commerce
INSERT INTO projects (
    title, slug, short_description, long_description,
    github_url, github_repo_name, github_language,
    category, tags, technologies,
    metrics, business_impact,
    is_featured, is_published, display_order,
    project_date, duration_months, team_size, role
) VALUES (
    'Analyse E-commerce avec SQL & Python',
    'ecommerce-sql-analysis',
    'Analyses approfondies des données e-commerce pour optimiser les ventes et le taux de conversion',
    'Projet d''analyse data pour un site e-commerce. Utilisation de SQL complexe (CTEs, Window Functions) pour extraire les insights, et Python pour la visualisation. Analyses : segmentation client RFM, analyse panier, funnel de conversion, et prédiction de LTV.',
    'https://github.com/votre-username/ecommerce-analysis',
    'ecommerce-analysis',
    'Python',
    'analysis',
    ARRAY['Data Analysis', 'SQL', 'Business Strategy'],
    ARRAY['SQL', 'Python', 'PostgreSQL', 'Jupyter', 'Pandas', 'Seaborn'],
    '{"queries": "50+", "insights": "15", "conversion_increase": "+12%"}',
    'Identification de 3 segments clients clés qui génèrent 70% du CA. Optimisation du funnel qui a augmenté le taux de conversion de 12%.',
    FALSE, -- not featured (top 3 only)
    TRUE,
    4,
    '2023-11-01',
    2,
    1,
    'Data Analyst'
);

-- Project 5: API REST with FastAPI
INSERT INTO projects (
    title, slug, short_description, long_description,
    github_url, github_repo_name, github_language,
    category, tags, technologies,
    metrics, business_impact,
    is_featured, is_published, display_order,
    project_date, duration_months, team_size, role
) VALUES (
    'API REST pour Portfolio Dynamique',
    'portfolio-api-fastapi',
    'API backend complète avec FastAPI pour gérer un portfolio professionnel dynamique',
    'API REST moderne avec FastAPI permettant de gérer toutes les données du portfolio (profil, timeline, projets, blog, témoignages). Documentation auto-générée avec Swagger, validation Pydantic, et intégration PostgreSQL asynchrone.',
    'https://github.com/votre-username/portfolio-api',
    'portfolio-api',
    'Python',
    'web_app',
    ARRAY['Backend', 'API', 'Web Development'],
    ARRAY['FastAPI', 'Python', 'PostgreSQL', 'asyncpg', 'Pydantic', 'Docker'],
    '{"endpoints": "25+", "response_time": "<50ms", "uptime": "99.9%"}',
    'Architecture backend scalable permettant de gérer un portfolio entièrement data-driven. Performance optimale et documentation complète pour intégrations futures.',
    FALSE,
    TRUE,
    5,
    '2025-01-15',
    1,
    1,
    'Backend Developer'
);

-- ============================================
-- 2. BLOG POSTS (Articles techniques)
-- ============================================

-- Article 1: Reconversion Data Science
INSERT INTO blog_posts (
    title, slug, excerpt, content,
    meta_title, meta_description, keywords,
    category, tags, read_time_minutes,
    is_published, is_featured, published_at
) VALUES (
    'De Commercial à Data Scientist : Mon Parcours de Reconversion en 2 Ans',
    'reconversion-commercial-data-scientist',
    'Comment j''ai réussi ma transition professionnelle du commerce vers la Data Science en 2 ans : formations, challenges, et conseils pratiques.',
    '# De Commercial à Data Scientist : Mon Parcours

À 26 ans, après 5 ans dans le commerce, j''ai décidé de tout plaquer pour me reconvertir en Data Science...

## Les Motivations
- Passion pour les chiffres et l''analyse
- Envie de combiner business et tech
- Impact mesurable des décisions data-driven

## Le Parcours
**Année 1 : Formation Intensive**
- 1500h de formation (Python, ML, SQL)
- 12 projets concrets
- 3 certifications obtenues

**Année 2 : Alternance**
- Application en contexte réel
- Projets ML en production
- Veille technologique continue

## Les Défis
1. **Syndrome de l''imposteur** : Normal et temporaire
2. **Courbe d''apprentissage** : Steep mais gérable
3. **Réseau professionnel** : À reconstruire from scratch

## Mes Conseils
✅ Choisir une formation avec projets concrets
✅ Construire un portfolio dès le début
✅ Networker dans la communauté data
✅ Ne pas négliger le business knowledge (votre atout !)

## Résultats après 2 ans
- 15+ projets ML/Data en portfolio
- CDI ou Freelance : les deux portes ouvertes
- Salaire : +40% vs commerce

**La reconversion est possible !** Votre expérience business est un ÉNORME atout en Data Science.',
    'Reconversion Commercial → Data Scientist : Guide Complet',
    'Découvrez comment réussir votre reconversion de commercial à data scientist en 2 ans : formations, projets, défis et conseils pratiques.',
    ARRAY['reconversion', 'data science', 'carrière', 'formation', 'commercial'],
    'case_study',
    ARRAY['Career', 'Data Science', 'Reconversion', 'Business'],
    8, -- 8 min read
    TRUE,
    TRUE, -- featured article
    '2025-01-15 10:00:00'
);

-- Article 2: ML en production
INSERT INTO blog_posts (
    title, slug, excerpt, content,
    meta_title, meta_description, keywords,
    category, tags, read_time_minutes,
    is_published, is_featured, published_at
) VALUES (
    'Déployer un Modèle ML en Production : Le Guide Pratique',
    'deployer-ml-production-guide',
    'Les étapes essentielles pour passer d''un notebook Jupyter à un modèle ML déployé en production avec FastAPI et Docker.',
    '# Déployer un Modèle ML en Production

Vous avez un modèle qui marche en local ? Parfait. Maintenant, comment le mettre en production ?

## Architecture Recommandée
```
Modèle Trained → FastAPI → Docker → Cloud (AWS/Azure/GCP)
```

## Étapes Clés

### 1. Préparer le Modèle
- Sérialiser avec joblib ou pickle
- Versionner le modèle (MLflow)
- Tester sur données réelles

### 2. Créer l''API
```python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("model.pkl")

@app.post("/predict")
def predict(data: InputData):
    prediction = model.predict(data.to_array())
    return {"prediction": prediction}
```

### 3. Dockeriser
```dockerfile
FROM python:3.11-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

### 4. Monitoring
- Logs détaillés
- Métriques de performance (latence, throughput)
- Drift detection (données + prédictions)

## Checklist Production
- [ ] Tests unitaires (>80% coverage)
- [ ] Documentation API (Swagger)
- [ ] Gestion erreurs et validations
- [ ] Rate limiting
- [ ] Logs structurés (JSON)
- [ ] Health check endpoint
- [ ] CI/CD pipeline

**Le ML en production n''est pas juste du code. C''est de l''engineering.**',
    'Déployer un Modèle ML en Production avec FastAPI et Docker',
    'Guide pratique complet pour déployer un modèle Machine Learning en production : API, Docker, monitoring et bonnes pratiques.',
    ARRAY['machine learning', 'production', 'fastapi', 'docker', 'mlops'],
    'tutorial',
    ARRAY['Machine Learning', 'MLOps', 'FastAPI', 'Docker', 'Production'],
    12,
    TRUE,
    TRUE,
    '2025-01-10 09:00:00'
);

-- Article 3: SQL avancé
INSERT INTO blog_posts (
    title, slug, excerpt, content,
    meta_title, meta_description, keywords,
    category, tags, read_time_minutes,
    is_published, is_featured, published_at
) VALUES (
    'SQL Avancé pour Data Scientists : CTEs, Window Functions et Optimisations',
    'sql-avance-data-scientists',
    'Maîtrisez les techniques SQL avancées essentielles pour tout Data Scientist : CTEs, Window Functions, et optimisation de requêtes.',
    '# SQL Avancé pour Data Scientists

SQL n''est pas juste SELECT FROM WHERE. Voici les techniques qui font la différence.

## 1. CTEs (Common Table Expressions)
```sql
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC(''month'', order_date) as month,
        SUM(amount) as revenue
    FROM orders
    GROUP BY 1
),
growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) as prev_month,
        revenue - LAG(revenue) OVER (ORDER BY month) as growth
    FROM monthly_sales
)
SELECT * FROM growth;
```

## 2. Window Functions
Les plus utiles :
- `ROW_NUMBER()` : Ranking sans ex-aequo
- `RANK()` : Ranking avec ex-aequo
- `LAG()/LEAD()` : Valeurs précédentes/suivantes
- `SUM() OVER()` : Cumulative sums

## 3. Optimisation
### Avant (lent)
```sql
SELECT * FROM orders WHERE YEAR(order_date) = 2024;
```

### Après (rapide)
```sql
SELECT * FROM orders
WHERE order_date >= ''2024-01-01''
  AND order_date < ''2025-01-01'';
```

## Pourquoi c''est crucial ?
- 80% du temps d''un DS est de la data prep
- SQL bien écrit = 100x plus rapide que Pandas
- Moins de données = moins de RAM = meilleurs perfs

**Investir dans SQL, c''est investir dans votre productivité.**',
    'SQL Avancé pour Data Scientists : CTEs et Window Functions',
    'Techniques SQL avancées indispensables : CTEs, Window Functions, optimisations pour requêtes 100x plus rapides.',
    ARRAY['sql', 'data science', 'analytics', 'performance', 'database'],
    'tutorial',
    ARRAY['SQL', 'Data Science', 'Analytics', 'Database'],
    10,
    TRUE,
    FALSE,
    '2025-01-05 14:00:00'
);

-- ============================================
-- 3. TESTIMONIALS (Social Proof)
-- ============================================

-- Testimonial 1: Manager
INSERT INTO testimonials (
    author_name, author_title, author_company,
    author_linkedin_url,
    quote, rating,
    relationship, project_context, date_given,
    is_featured, is_published, display_order
) VALUES (
    'Sophie Martin',
    'Head of Data Science',
    'TechCorp France',
    'https://linkedin.com/in/sophie-martin-example',
    'Raouf a démontré une capacité exceptionnelle à traduire des problèmes business complexes en solutions ML concrètes. Son background commercial est un atout majeur : il comprend les enjeux métier et communique efficacement avec les stakeholders non-techniques. Le modèle de churn prediction qu''il a développé nous fait économiser 500K€/an.',
    5,
    'manager',
    'Projet ML Churn Prediction',
    '2024-12-15',
    TRUE, -- featured
    TRUE,
    1
);

-- Testimonial 2: Colleague
INSERT INTO testimonials (
    author_name, author_title, author_company,
    author_linkedin_url,
    quote, rating,
    relationship, project_context, date_given,
    is_featured, is_published, display_order
) VALUES (
    'Marc Dubois',
    'Senior Data Engineer',
    'TechCorp France',
    'https://linkedin.com/in/marc-dubois-example',
    'Travailler avec Raouf a été un plaisir. Il est rigoureux, autonome, et toujours curieux d''apprendre. Son code est propre, bien documenté, et il suit les bonnes pratiques MLOps. Il a rapidement monté en compétences sur FastAPI et Docker pour déployer nos modèles en production.',
    5,
    'colleague',
    'Collaboration équipe Data',
    '2024-11-20',
    TRUE,
    TRUE,
    2
);

-- Testimonial 3: Client (Freelance)
INSERT INTO testimonials (
    author_name, author_title, author_company,
    author_linkedin_url,
    quote, rating,
    relationship, project_context, date_given,
    is_featured, is_published, display_order
) VALUES (
    'Jean Dupont',
    'CEO',
    'StartupXYZ',
    'https://linkedin.com/in/jean-dupont-example',
    'Raouf nous a aidés à construire notre premier dashboard analytics. Il a su comprendre nos besoins business, proposer une solution adaptée, et livrer dans les temps. Communication claire, proactivité, et résultats au rendez-vous. Je le recommande vivement pour des missions data/ML.',
    5,
    'client',
    'Mission freelance Dashboard Analytics',
    '2024-10-30',
    TRUE,
    TRUE,
    3
);

-- Testimonial 4: Mentor
INSERT INTO testimonials (
    author_name, author_title, author_company,
    author_linkedin_url,
    quote, rating,
    relationship, project_context, date_given,
    is_featured, is_published, display_order
) VALUES (
    'Dr. Pierre Laurent',
    'Lead Data Scientist & Mentor',
    'DataAcademy',
    'https://linkedin.com/in/pierre-laurent-example',
    'J''ai suivi Raouf pendant sa formation intensive en Data Science. Parmi les 50 élèves de la promo, il s''est démarqué par sa détermination, son pragmatisme, et sa capacité à aller au-delà des exercices demandés. Sa reconversion depuis le commerce lui donne une vision unique du métier.',
    5,
    'mentor',
    'Formation Data Science intensive',
    '2023-12-10',
    FALSE,
    TRUE,
    4
);

-- ============================================
-- 4. GITHUB STATS (Initial seed - will be updated via API)
-- ============================================

INSERT INTO github_stats (
    username,
    total_repos, total_stars, total_forks,
    followers, following,
    total_contributions_year, current_streak_days, longest_streak_days,
    languages,
    top_repos,
    last_fetched_at
) VALUES (
    'votre-username', -- CHANGE THIS
    25, -- total repos
    150, -- total stars
    30, -- total forks
    50, -- followers
    40, -- following
    800, -- contributions this year
    15, -- current streak
    45, -- longest streak
    '{"Python": 45, "JavaScript": 25, "SQL": 15, "TypeScript": 10, "Other": 5}'::jsonb,
    '[
        {"name": "churn-prediction", "stars": 50, "language": "Python", "description": "ML model for customer churn prediction"},
        {"name": "analytics-dashboard", "stars": 35, "language": "Python", "description": "Real-time analytics dashboard with Streamlit"},
        {"name": "portfolio-automation", "stars": 30, "language": "Python", "description": "Automated portfolio with n8n and AI"},
        {"name": "ecommerce-analysis", "stars": 20, "language": "Python", "description": "E-commerce data analysis with SQL"},
        {"name": "portfolio-api", "stars": 15, "language": "Python", "description": "FastAPI backend for dynamic portfolio"}
    ]'::jsonb,
    CURRENT_TIMESTAMP
);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Phase 2 seed data inserted successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 IMPORTANT: Personnalisez ces données:';
    RAISE NOTICE '1. Projects: Remplacez avec vos vrais projets GitHub';
    RAISE NOTICE '2. Blog: Écrivez vos propres articles';
    RAISE NOTICE '3. Testimonials: Ajoutez de vrais témoignages';
    RAISE NOTICE '4. GitHub Stats: Changez le username (ligne 356)';
    RAISE NOTICE '';
    RAISE NOTICE '🔍 Vérifiez: SELECT COUNT(*) FROM projects; (5 projets)';
    RAISE NOTICE '🔍 Vérifiez: SELECT COUNT(*) FROM blog_posts; (3 articles)';
    RAISE NOTICE '🔍 Vérifiez: SELECT COUNT(*) FROM testimonials; (4 témoignages)';
END $$;
