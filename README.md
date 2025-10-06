# 🚀 Portfolio Automatisé Dual-Mode

> **Portfolio professionnel intelligent avec double personnalité : mode CDI pour recruteurs et mode Freelance pour clients**

Un système de portfolio full-stack moderne qui s'auto-alimente depuis vos projets GitHub, génère du contenu avec IA, et s'adapte à votre audience grâce à un système dual-mode unique.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5A?logo=n8n)](https://n8n.io/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000)](https://ollama.ai/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Table des Matières

- [Concept](#-concept)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation Rapide](#-installation-rapide)
- [Utilisation](#-utilisation)
- [Structure du Projet](#-structure-du-projet)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Workflows n8n](#-workflows-n8n)
- [Développement](#-développement)
- [FAQ](#-faq)

---

## 🎯 Concept

### Le Problème

Vous êtes développeur/data scientist et vous avez besoin de :
- **Pour les recruteurs** : Un portfolio technique avec vos compétences, projets open source, certifications
- **Pour les clients freelance** : Une vitrine business avec cas clients, ROI, services, témoignages
- Maintenir votre portfolio à jour avec vos nouveaux projets GitHub
- Rédiger des descriptions professionnelles pour chaque projet
- Mesurer l'engagement de vos visiteurs

### La Solution

Un portfolio intelligent qui :
1. **Se met à jour automatiquement** en scannant vos repos GitHub toutes les 6h
2. **Génère du contenu professionnel** avec IA locale (Ollama)
3. **S'adapte à votre audience** avec un système dual-mode (CDI/Freelance)
4. **Track l'engagement** avec analytics intégré
5. **Offre une API REST** pour intégration externe

### Dual-Mode : La Différenciation Unique

| Mode | Audience | Contenu | Objectif |
|------|----------|---------|----------|
| **CDI** | Recruteurs, RH, Managers | Compétences techniques, open source, certifications, parcours | Décrocher un CDI en tech |
| **Freelance** | Clients, Entrepreneurs, PME | ROI, cas clients, services, tarifs, témoignages | Vendre des missions freelance |

Un simple toggle permet de passer d'un mode à l'autre, changeant instantanément le contenu affiché.

---

## ✨ Fonctionnalités

### 🎨 Frontend React

#### Pages Principales
- **Hero Section** : Présentation personnalisée par mode avec photo et pitch
- **Timeline Interactive** : Parcours professionnel avec animations
- **Projets Showcase** : Grid de projets avec filtres par techno/catégorie
- **Blog Intégré** : Articles techniques avec markdown, catégories, tags
- **Compétences** : Skills techniques et business avec visualisations
- **Témoignages** : Carousel de recommandations
- **Contact** : Formulaire avec validation et tracking

#### Fonctionnalités Avancées
- **Dual Mode Toggle** : Switch instantané CDI ↔ Freelance
- **Analytics Dashboard** (admin) : Stats visiteurs, projets populaires, conversions
- **Export CV PDF** : Génération dynamique depuis la base de données
- **Responsive Design** : Mobile-first avec Tailwind CSS
- **Dark Mode Ready** : Thème sombre (à activer)
- **Animations Smooth** : Framer Motion pour les transitions

### ⚙️ Backend FastAPI

#### API REST Complète
```
GET  /api/profile              # Profil utilisateur
GET  /api/timeline             # Parcours professionnel
GET  /api/projects             # Liste projets (avec filtres)
GET  /api/mode-projects        # Projets par mode (CDI/Freelance)
GET  /api/blog                 # Articles de blog
GET  /api/testimonials         # Témoignages
GET  /api/skills               # Compétences
GET  /api/github-stats         # Stats GitHub en temps réel
POST /api/contact              # Formulaire de contact
POST /api/analytics/event      # Tracking d'événements
GET  /api/analytics/summary    # Résumé analytics
GET  /api/modes                # Configuration des modes
GET  /api/content/{field}      # Contenu adapté par mode
GET  /api/export/cv            # Export CV en PDF
```

#### Fonctionnalités Backend
- **CORS configuré** pour intégration frontend
- **Validation Pydantic** pour toutes les entrées
- **Connection pooling** PostgreSQL asynchrone (asyncpg)
- **Error handling** avec logs détaillés
- **Health check** endpoint pour monitoring
- **Rate limiting** (optionnel, à activer)

### 🤖 Automation n8n

#### 4 Workflows Actifs

1. **GitHub Portfolio Sync** (toutes les 6h)
   - Scan automatique de vos repos GitHub
   - Filtre repos récents ou populaires (>5 stars)
   - Génération résumés avec Ollama (LLM local)
   - Insertion automatique en base de données
   - Notification si confidence IA < 80%

2. **Visitor Notifications** (toutes les 15min)
   - Détection de nouveaux visiteurs
   - Alertes temps réel (email/Slack/Telegram)
   - Géolocalisation et user agent
   - Stats de session (durée, pages vues)

3. **Analytics Daily Digest** (tous les jours à 9h)
   - Rapport quotidien complet
   - Comparaison vs veille/semaine
   - Projets les plus consultés
   - Taux de conversion par mode
   - Envoi par email automatique

4. **Content Review Alerts** (toutes les 12h)
   - Détection projets avec faible confidence IA
   - Liste articles de blog en draft
   - Témoignages en attente de validation
   - Rappels pour mise à jour contenu

### 🧠 IA & Machine Learning

- **Ollama** : LLM local pour génération de contenu (mistral:instruct, llama3.2)
- **MCP Sidecar** : Bridge API pour GitHub (liste repos, lecture README)
- **Résumés automatiques** : Génération descriptions projets
- **Confidence scoring** : Score 0-100 pour qualité des résumés IA
- **Validation humaine** : Loop de validation si score < 80%

### 📊 Analytics & Tracking

- **Event tracking** : Page views, clics projets, switch mode, soumissions contact
- **Session tracking** : Durée, pages, referrer, device
- **Mode performance** : Comparaison engagement CDI vs Freelance
- **Conversion goals** : Tracking objectifs (téléchargements CV, contacts)
- **Heatmaps** (à venir) : Visualisation des zones chaudes

### 🗄️ Base de Données PostgreSQL

#### Tables Principales

**Phase 1 - Profil & Timeline**
- `profile` : Données personnelles (nom, titre, bio, photo, liens sociaux)
- `timeline_events` : Parcours professionnel (formation, alternance, expériences)
- `skills` : Compétences techniques et business
- `social_links` : LinkedIn, GitHub, Twitter, etc.

**Phase 2 - Contenu**
- `projects` : Projets portfolio avec slug, description, techno, GitHub stats
- `blog_posts` : Articles avec markdown, catégories, temps de lecture
- `testimonials` : Témoignages avec auteur, role, photo
- `github_stats` : Stats GitHub temps réel (contributions, langages, repos)
- `contact_submissions` : Messages formulaire de contact

**Phase 3 - Dual Mode & Analytics**
- `portfolio_modes` : Configuration modes CDI/Freelance
- `mode_content_overrides` : Surcharge contenu par mode
- `analytics_events` : Events tracking (page_view, project_click, etc.)
- `visitor_sessions` : Sessions utilisateurs avec referrer, device
- `conversion_goals` : Objectifs de conversion par mode

---

## 🏗️ Architecture

### Stack Technique

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
│              http://localhost:3000                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React 18 + Vite)                  │
│  • Tailwind CSS  • React Router  • Framer Motion        │
│  • Axios  • Context API  • Markdown Renderer            │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────┐
│            BACKEND (FastAPI + Python 3.11)               │
│  • asyncpg  • Pydantic  • ReportLab (PDF)  • CORS       │
└───┬──────────────────────────────────────────────────┬──┘
    │                                                    │
    ▼                                                    ▼
┌─────────────────────┐                    ┌──────────────────────┐
│  PostgreSQL 15      │                    │   n8n Workflows      │
│  • 11 tables        │                    │   • GitHub sync      │
│  • Triggers         │◄───────────────────┤   • Notifications    │
│  • Views            │                    │   • Analytics        │
│  • Indexes          │                    │   • Content review   │
└─────────────────────┘                    └──────┬───────────────┘
                                                   │
                                                   ▼
                                          ┌──────────────────┐
                                          │  Ollama + MCP    │
                                          │  • mistral       │
                                          │  • llama3.2      │
                                          │  • GitHub API    │
                                          └──────────────────┘
```

### Services Docker

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **dashboard-frontend** | nginx:alpine | 3000 | React app (production build) |
| **dashboard-backend** | python:3.11 | 8000 | FastAPI server |
| **postgresql** | postgres:15 | 5432 | Base de données |
| **n8n** | n8nio/n8n:latest | 5678 | Workflow automation |
| **ollama** | ollama/ollama:latest | 11434 | LLM local inference |
| **sidecar-mcp** | node:18-alpine | 8080 | GitHub API bridge |

### Flux de Données

**1. Création de contenu (Automatique)**
```
GitHub Repos → MCP Sidecar → n8n Workflow → Ollama (IA) → PostgreSQL → API → Frontend
```

**2. Consultation visiteur (Temps réel)**
```
Utilisateur → Frontend → API → PostgreSQL → Analytics → n8n → Notifications
```

**3. Dual Mode Switch (Instantané)**
```
Toggle Mode → Context Update → API fetch → Content Override → Re-render
```

---

## 🚀 Installation Rapide

### Prérequis

- **Docker Desktop** : [Télécharger ici](https://www.docker.com/get-started/)
- **Git** : [Télécharger ici](https://git-scm.com/)
- **Windows 10/11** ou **Linux/MacOS**

### Installation en 3 minutes

#### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-username/automatisation_n8n.git
cd automatisation_n8n
```

#### Étape 2 : Lancer le setup automatique

**Windows :**
```powershell
.\setup-win.ps1
```

**Linux/MacOS :**
```bash
chmod +x setup-win.ps1
./setup-win.ps1
```

Le script va :
- Créer le fichier `.env` avec mot de passe aléatoire
- Démarrer tous les services Docker
- Appliquer les migrations de base de données
- Peupler avec des données de démo

#### Étape 3 : Vérifier l'installation

```bash
docker compose ps
```

Tous les services doivent être `Up` :
```
✅ postgresql          Up      5432/tcp
✅ n8n                 Up      5678/tcp
✅ ollama              Up      11434/tcp
✅ sidecar-mcp         Up      8080/tcp
✅ dashboard-backend   Up      8000/tcp
✅ dashboard-frontend  Up      3000/tcp
```

#### Étape 4 : Accéder aux services

- **Portfolio** : http://localhost:3000
- **API Docs** : http://localhost:8000/docs
- **n8n** : http://localhost:5678 (voir `.env` pour credentials)

---

## 🎮 Utilisation

### Personnaliser votre profil

#### 1. Modifier les données de seed

Éditez les fichiers SQL avec vos vraies informations :

```sql
-- sql/phase1_seed.sql (Profil)
INSERT INTO profile (full_name, title, hero_pitch, ...)
VALUES (
  'Votre Nom',
  'Data Scientist | ML Engineer',
  'Votre pitch accrocheur ici...',
  ...
);

-- Ajoutez vos vrais événements de parcours
INSERT INTO timeline_events (date, title, description, category) VALUES
('2023-09-01', 'Début Alternance Data Scientist', '...', 'alternance'),
...
```

#### 2. Appliquer les changements

```bash
cat sql/phase1_seed.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
```

#### 3. Redémarrer le frontend

```bash
docker compose restart dashboard-frontend
```

### Ajouter vos projets GitHub

#### Option 1 : Automatique (Recommandé)

1. Configurez votre token GitHub dans `.env` :
```bash
GITHUB_TOKEN=ghp_votre_token_personnel
GITHUB_USERNAME=votre-username
```

2. Importez le workflow n8n :
   - Ouvrez http://localhost:5678
   - Settings → Import from File
   - Sélectionnez `n8n/workflows/1_github_portfolio_sync.json`
   - Activez le workflow

3. Exécutez manuellement ou attendez la prochaine exécution (6h)

#### Option 2 : Manuelle

```sql
INSERT INTO projects (
  slug, title, short_description, category, tags,
  github_url, github_stars, github_language,
  featured, target_modes, status
) VALUES (
  'mon-super-projet',
  'Mon Super Projet ML',
  'Description courte et percutante',
  'Machine Learning',
  ARRAY['Python', 'TensorFlow', 'Docker'],
  'https://github.com/votre-user/projet',
  42,
  'Python',
  true,
  ARRAY['cdi', 'freelance'],
  'published'
);
```

### Écrire un article de blog

#### 1. Ajouter l'article en base

```sql
INSERT INTO blog_posts (
  slug, title, excerpt, content, category, tags,
  published_date, read_time_minutes, featured
) VALUES (
  'mon-premier-article',
  'Comment j''ai appris le Machine Learning',
  'Retour d''expérience sur 6 mois d''apprentissage intensif...',
  '# Introduction\n\nContenu markdown ici...',
  'Reconversion',
  ARRAY['ML', 'Apprentissage', 'Conseils'],
  NOW(),
  8,
  true
);
```

#### 2. Vérifier sur le frontend

Visitez http://localhost:3000/blog

### Configurer le Dual Mode

#### Personnaliser le contenu par mode

```sql
-- Surcharge du hero pitch en mode Freelance
INSERT INTO mode_content_overrides (
  mode_key, content_type, content_id, override_field, override_value
) VALUES (
  'freelance',
  'profile',
  1,
  'hero_pitch',
  'Expert Data Science & IA - Transformez vos données en ROI mesurable 📈'
);

-- Surcharge description projet en mode CDI
INSERT INTO mode_content_overrides (
  mode_key, content_type, content_id, override_field, override_value
) VALUES (
  'cdi',
  'project',
  1, -- ID du projet
  'short_description',
  'Projet open source démontrant expertise en ML et bonnes pratiques DevOps'
);
```

### Consulter les analytics

#### Via API

```bash
# Résumé global
curl http://localhost:8000/api/analytics/summary | jq

# Comparaison modes
curl http://localhost:8000/api/analytics/mode-comparison | jq

# Sessions récentes
curl http://localhost:8000/api/analytics/sessions?limit=10 | jq
```

#### Via SQL

```sql
-- Vue performance par mode
SELECT * FROM mode_performance_comparison;

-- Résumé quotidien
SELECT * FROM analytics_daily_summary ORDER BY date DESC LIMIT 7;

-- Top projets
SELECT
  p.title,
  COUNT(*) as views
FROM analytics_events ae
JOIN projects p ON (ae.event_data->>'project_id')::int = p.id
WHERE ae.event_type = 'project_click'
GROUP BY p.title
ORDER BY views DESC
LIMIT 10;
```

---

## 📁 Structure du Projet

```
automatisation_n8n/
├── 📄 README.md                    # Documentation principale
├── 📄 CLAUDE.md                    # Instructions Claude Code
├── 📄 docker-compose.yml            # Stack Docker
├── 📄 setup-win.ps1                # Script setup Windows
├── 📄 .env                         # Variables d'environnement (non committé)
├── 📄 .env.example                 # Template .env
│
├── 📁 dashboard/
│   ├── 📁 backend/
│   │   ├── main.py                 # FastAPI server
│   │   ├── requirements.txt        # Dépendances Python
│   │   └── Dockerfile
│   │
│   └── 📁 frontend/
│       ├── 📁 src/
│       │   ├── 📁 components/      # Composants React
│       │   ├── 📁 pages/           # Pages
│       │   ├── 📁 context/         # Context API
│       │   ├── 📁 services/        # API services
│       │   └── App.jsx             # App principale
│       ├── package.json
│       ├── vite.config.js
│       ├── tailwind.config.js
│       ├── nginx.conf              # Config Nginx production
│       └── Dockerfile
│
├── 📁 sql/
│   ├── phase1_schema.sql           # Tables: profile, timeline, skills
│   ├── phase1_seed.sql             # Données initiales Phase 1
│   ├── phase2_schema.sql           # Tables: projects, blog, testimonials
│   ├── phase2_seed.sql             # Données initiales Phase 2
│   ├── phase3_schema.sql           # Tables: modes, analytics
│   └── phase3_seed.sql             # Données initiales Phase 3
│
├── 📁 n8n/
│   └── 📁 workflows/
│       ├── 1_github_portfolio_sync.json
│       ├── 2_visitor_notifications.json
│       ├── 3_analytics_daily_digest.json
│       └── 4_content_review_alerts.json
│
├── 📁 sidecar-mcp/
│   ├── 📁 src/
│   │   ├── index.ts                # Express server
│   │   ├── github.ts               # GitHub API integration
│   │   └── mcpTools.ts             # Tool registry
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── 📁 prompts/
│   ├── system_agent.md             # Prompt système IA
│   ├── summarize_project.md        # Prompt résumé projet
│   └── validate_publish.md         # Prompt validation
│
└── 📁 volumes/                     # Données persistantes Docker
    ├── postgres_data/
    ├── n8n_data/
    └── ollama_data/
```

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# PostgreSQL
DB_HOST=db
DB_PORT=5432
DB_NAME=n8n_database
DB_USER=admin_user_db
DB_PASSWORD=<généré_automatiquement>

# n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<généré_automatiquement>
N8N_HOST=0.0.0.0
N8N_PORT=5678

# GitHub (optionnel, pour automation)
GITHUB_TOKEN=ghp_votre_token_personnel
GITHUB_USERNAME=votre-username

# Notifications (optionnel)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Email (optionnel, pour analytics digest)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password
```

### Obtenir un GitHub Token

1. Allez sur https://github.com/settings/tokens
2. "Generate new token" → "Classic"
3. Scopes : `public_repo`, `read:user`
4. Copiez le token dans `.env`

### Configurer Slack Notifications

1. Créez une app Slack : https://api.slack.com/apps
2. Activez "Incoming Webhooks"
3. "Add New Webhook to Workspace"
4. Copiez l'URL dans `.env`

---

## 📚 API Documentation

### Endpoints Principaux

#### Profil

```bash
GET /api/profile
# Response: { full_name, title, bio, hero_pitch, email, linkedin_url, ... }

GET /api/timeline
# Response: [{ date, title, description, category, metrics }]
```

#### Projets

```bash
GET /api/projects?featured_only=true&category=Machine%20Learning
# Query params: featured_only, category, limit, offset
# Response: [{ id, slug, title, short_description, tags, github_url, ... }]

GET /api/mode-projects?mode=cdi&featured_only=true
# Projets adaptés au mode sélectionné avec overrides appliqués
```

#### Blog

```bash
GET /api/blog?featured_only=true&limit=3
# Response: [{ slug, title, excerpt, category, tags, published_date, ... }]

GET /api/blog/{slug}
# Response: { slug, title, content (markdown), ... }
```

#### Analytics

```bash
POST /api/analytics/event
# Body: { event_type, event_data, referrer }
# Events: page_view, project_click, mode_switch, contact_submit, cv_download

GET /api/analytics/summary?days=7
# Response: { total_views, unique_visitors, avg_session_duration, ... }

GET /api/analytics/mode-comparison
# Response: { cdi: {...}, freelance: {...} }
```

#### Contact

```bash
POST /api/contact
# Body: { name, email, subject, message, mode }
# Response: { success: true, message: "..." }
```

### Exemples cURL

```bash
# Récupérer profil
curl http://localhost:8000/api/profile | jq

# Tracker un event
curl -X POST http://localhost:8000/api/analytics/event \
  -H 'Content-Type: application/json' \
  -d '{
    "event_type": "page_view",
    "event_data": {"page": "/projects"},
    "referrer": "https://google.com"
  }'

# Envoyer message contact
curl -X POST http://localhost:8000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Demande mission freelance",
    "message": "Bonjour, je souhaite...",
    "mode": "freelance"
  }'
```

---

## 🤖 Workflows n8n

### 1. GitHub Portfolio Sync

**Déclencheur** : Cron toutes les 6h (ou webhook manuel)

**Étapes** :
1. Fetch repos depuis GitHub via MCP Sidecar
2. Filtrer repos (récents ou >5 stars)
3. Lire README de chaque repo
4. Générer résumé avec Ollama (prompt: `prompts/summarize_project.md`)
5. Calculer confidence score (0-100)
6. Insérer en base PostgreSQL
7. Si confidence < 80% → Notification Slack pour validation manuelle
8. Si confidence ≥ 80% → Auto-publication

**Import** : `n8n/workflows/1_github_portfolio_sync.json`

### 2. Visitor Notifications

**Déclencheur** : Cron toutes les 15min

**Étapes** :
1. Query PostgreSQL pour nouvelles sessions (15 dernières min)
2. Grouper par referrer et device
3. Formatter notification
4. Envoyer via Slack/Telegram/Email

**Import** : `n8n/workflows/2_visitor_notifications.json`

### 3. Analytics Daily Digest

**Déclencheur** : Cron tous les jours à 9h

**Étapes** :
1. Calculer métriques journalières (views, visiteurs, durée session)
2. Comparer vs veille et vs semaine dernière
3. Top 5 projets les plus consultés
4. Taux de conversion par mode
5. Générer rapport HTML
6. Envoyer par email

**Import** : `n8n/workflows/3_analytics_daily_digest.json`

### 4. Content Review Alerts

**Déclencheur** : Cron toutes les 12h

**Étapes** :
1. Lister projets avec confidence IA < 80%
2. Lister articles de blog en draft
3. Lister témoignages non validés
4. Si contenu en attente → Notification avec liens directs

**Import** : `n8n/workflows/4_content_review_alerts.json`

### Importer un workflow

1. Ouvrez http://localhost:5678
2. Login avec credentials dans `.env`
3. Menu → "Import from File"
4. Sélectionnez le fichier JSON
5. Configurez les credentials (PostgreSQL, Slack, etc.)
6. Activez le workflow (toggle en haut à droite)

---

## 💻 Développement

### Mode Développement Local

#### Backend

```bash
cd dashboard/backend

# Créer venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Lancer en mode dev (hot reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd dashboard/frontend

# Installer dépendances
npm install

# Lancer en mode dev (hot reload)
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### Tests

#### Backend
```bash
pytest dashboard/backend/tests/
```

#### Frontend
```bash
cd dashboard/frontend
npm run test
```

### Linting

#### Backend
```bash
black dashboard/backend/*.py
flake8 dashboard/backend/
```

#### Frontend
```bash
cd dashboard/frontend
npm run lint
npm run format
```

### Ajouter une nouvelle table

1. Créer migration SQL dans `sql/`
2. Appliquer migration :
```bash
cat sql/nouvelle_migration.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
```
3. Mettre à jour les models Pydantic dans `backend/main.py`
4. Créer endpoints API correspondants

---

## 🔧 FAQ

### Comment changer le port du portfolio ?

Éditez `docker-compose.yml` :
```yaml
dashboard-frontend:
  ports:
    - "8080:80"  # Au lieu de 3000:80
```

### Comment ajouter un modèle Ollama ?

```bash
docker exec ollama ollama pull <model_name>
# Exemples: mistral:instruct, llama3.2:1b, codellama:13b
```

### Comment backup la base de données ?

```bash
docker exec postgresql pg_dump -U admin_user_db n8n_database > backup_$(date +%Y%m%d).sql
```

### Comment restaurer un backup ?

```bash
cat backup_20231215.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
```

### Comment reset complètement la base ?

```bash
docker compose down -v  # Supprime les volumes
docker compose up -d
# Réappliquer les migrations
cat sql/phase1_schema.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase1_seed.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
# ... idem pour phase2 et phase3
```

### Les workflows n8n ne se déclenchent pas

1. Vérifier que le workflow est **activé** (toggle vert)
2. Vérifier les credentials (PostgreSQL, GitHub)
3. Tester manuellement : bouton "Execute Workflow"
4. Consulter les logs : `docker compose logs n8n -f`

### Comment voir les logs en temps réel ?

```bash
# Tous les services
docker compose logs -f

# Un service spécifique
docker compose logs -f dashboard-backend
docker compose logs -f n8n
docker compose logs -f postgresql
```

### Ollama est lent / ne répond pas

Ollama nécessite de bonnes ressources CPU/RAM :
- CPU : 4+ cores recommandés
- RAM : 8GB+ recommandés
- Pour des modèles plus légers : `llama3.2:1b` (1.3GB) au lieu de `mistral:instruct` (4.1GB)

### Comment déployer en production ?

Voir guide détaillé : [DEPLOYMENT.md](./DEPLOYMENT.md) (à créer)

Checklist rapide :
- [ ] Changer tous les passwords dans `.env`
- [ ] Configurer domaine et SSL (Let's Encrypt)
- [ ] Désactiver debug mode FastAPI
- [ ] Configurer CORS avec domaine prod
- [ ] Ajouter rate limiting API
- [ ] Configurer backups automatiques DB
- [ ] Monitoring (Sentry, Uptime Robot)
- [ ] Utiliser `docker compose -f docker-compose.prod.yml`

---

## 📊 Roadmap

### ✅ Phase 1 - MVP (Complété)
- [x] Hero + Timeline + Profile
- [x] Backend API REST
- [x] Base de données PostgreSQL

### ✅ Phase 2 - Contenu (Complété)
- [x] Projets showcase
- [x] Blog avec markdown
- [x] Témoignages
- [x] Formulaire contact
- [x] GitHub stats

### ✅ Phase 3 - Advanced (Complété)
- [x] Dual mode CDI/Freelance
- [x] Analytics tracking
- [x] Mode content overrides
- [x] n8n automation workflows

### 🚧 Phase 4 - AI Features (En cours)
- [ ] Resume tailoring (génération CV adapté à une offre)
- [ ] Skill matcher (match % avec job description)
- [ ] ROI calculator (Freelance mode)
- [ ] Chatbot FAQ (Ollama)

### 🔮 Phase 5 - Growth (Futur)
- [ ] SEO optimization avancée
- [ ] Social media auto-posting
- [ ] A/B testing dual mode
- [ ] Heatmaps & session replay
- [ ] Mobile app (PWA)
- [ ] Multi-langue (FR/EN)

---

## 🤝 Contribution

Ce projet est personnel mais ouvert aux suggestions !

Pour proposer une amélioration :
1. Fork le repo
2. Créer une branche feature
3. Commit vos changements
4. Push et créer une Pull Request

---

## 📄 Licence

MIT License - Libre d'utilisation, attribution appréciée.

---

## 💬 Support

- **Issues** : [GitHub Issues](https://github.com/votre-username/automatisation_n8n/issues)
- **Docs n8n** : https://docs.n8n.io/
- **Docs FastAPI** : https://fastapi.tiangolo.com/
- **Docs React** : https://react.dev/

---

**🎉 Bon développement et que votre portfolio brille !**
