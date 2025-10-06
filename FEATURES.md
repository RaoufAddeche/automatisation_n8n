# 📖 Concept & Fonctionnalités Détaillées

> **Guide complet du système Portfolio Automatisé Dual-Mode**

Ce document explique en profondeur le concept, l'architecture, et chaque fonctionnalité du système.

---

## 📋 Table des Matières

1. [Concept Général](#1-concept-général)
2. [Dual-Mode : L'Innovation Clé](#2-dual-mode--linnovation-clé)
3. [Frontend React - Détails](#3-frontend-react---détails)
4. [Backend FastAPI - Détails](#4-backend-fastapi---détails)
5. [Automation n8n - Détails](#5-automation-n8n---détails)
6. [Intelligence Artificielle](#6-intelligence-artificielle)
7. [Analytics & Tracking](#7-analytics--tracking)
8. [Base de Données](#8-base-de-données)
9. [Workflow Complet](#9-workflow-complet)
10. [Cas d'Usage](#10-cas-dusage)

---

## 1. Concept Général

### 🎯 La Vision

**Problème** : Les développeurs et data scientists ont des besoins différents selon leur audience :
- **Recruteurs** cherchent des compétences techniques, certifications, open source
- **Clients freelance** cherchent des résultats business, ROI, témoignages

Avoir **deux portfolios séparés** est fastidieux :
- Maintenance double
- Contenu qui se recoupe partiellement
- Risque d'incohérence
- Difficulté de mise à jour

**Solution** : Un seul portfolio avec **double personnalité** qui s'adapte instantanément à l'audience.

### 🚀 Les 5 Piliers

#### 1. **Automatisation Intelligente**
- Scan automatique GitHub toutes les 6h
- Génération de contenu par IA locale (Ollama)
- Validation humaine pour le contenu critique
- Publication automatique si qualité suffisante

#### 2. **Dual-Mode Adaptatif**
- Toggle instantané CDI ↔ Freelance
- Contenu adapté par mode (hero pitch, descriptions projets, CTA)
- Analytics séparés par mode
- Objectifs de conversion différents

#### 3. **Backend API-First**
- API REST complète et documentée
- Utilisable par frontend, mobile, scripts
- Performance optimisée (asyncio, connection pooling)
- CORS configuré pour intégrations externes

#### 4. **Analytics Avancés**
- Event tracking granulaire
- Session tracking avec referrer/device
- Comparaison performance CDI vs Freelance
- Conversion goals personnalisés

#### 5. **Open Source & Extensible**
- Stack technique moderne et populaire
- Code propre et documenté
- Facile à forker et personnaliser
- Architecture modulaire

---

## 2. Dual-Mode : L'Innovation Clé

### 🎭 Philosophie du Dual-Mode

Le dual-mode n'est **pas qu'un simple toggle** de contenu. C'est une approche stratégique pour :
1. **Maximiser la pertinence** : Chaque visiteur voit le contenu qui lui parle
2. **Mesurer l'impact** : Quel mode convertit le mieux ?
3. **A/B testing naturel** : Comparer deux stratégies de communication
4. **Sauver du temps** : Un seul portfolio à maintenir

### 🔀 Fonctionnement Technique

#### Architecture du Mode Switch

```
User clicks toggle
    ↓
Frontend: Update Context (React Context API)
    ↓
Trigger API calls with ?mode=cdi or ?mode=freelance
    ↓
Backend: Query base + apply content_overrides
    ↓
Return adapted content
    ↓
Frontend: Re-render with new data
    ↓
Analytics: Track mode_switch event
```

#### Tables Impliquées

**1. `portfolio_modes`** : Configuration globale
```sql
{
  mode_key: 'cdi',
  display_name: 'Mode Recruteur',
  hero_cta_text: 'Télécharger mon CV',
  color_primary: '#3B82F6',
  conversion_goal: 'cv_download'
}
```

**2. `mode_content_overrides`** : Surcharges spécifiques
```sql
{
  mode_key: 'freelance',
  content_type: 'project',
  content_id: 5,
  override_field: 'short_description',
  override_value: 'Projet client : augmentation 40% conversions e-commerce'
}
```

**3. `analytics_events`** : Tracking du switch
```sql
{
  event_type: 'mode_switch',
  event_data: {
    from_mode: 'cdi',
    to_mode: 'freelance',
    session_duration_before_switch: 120
  }
}
```

### 📊 Comparaison des Modes

| Aspect | Mode CDI | Mode Freelance |
|--------|----------|----------------|
| **Ton** | Professionnel, technique | Business, orienté résultats |
| **Hero Pitch** | "Data Scientist passionné par le ML" | "Transformez vos données en ROI mesurable" |
| **Projets** | Détails techniques, stack, architecture | Impact business, gains chiffrés, témoignages |
| **CTA Principal** | "Télécharger mon CV" | "Demander un devis" |
| **Compétences** | Frameworks, langages, certifications | Communication, gestion projet, ROI |
| **Timeline** | Parcours académique et pro | Missions clients, résultats |
| **Blog** | Tutoriels techniques, code | Cas d'usage, ROI, vulgarisation |
| **Contact** | Candidature spontanée, réseau | Demande de mission, audit gratuit |

### 🎨 Adaptation Visuelle

#### Couleurs par Mode
- **CDI** : Bleu (#3B82F6) - Confiance, professionnalisme
- **Freelance** : Vert (#10B981) - Croissance, ROI, business

#### Layout Changes
- **CDI** : Timeline en avant, certifications visibles
- **Freelance** : Témoignages en avant, prix indicatifs, calculator ROI

#### Content Override Examples

**Hero Pitch**
```
CDI:        "Data Scientist en alternance, spécialisé en ML/DL"
Freelance:  "Expert Data & IA - +40% ROI clients en moyenne"
```

**Projet : Churn Prediction**
```
CDI:        "Modèle ML de prédiction de churn avec 92% accuracy (scikit-learn, XGBoost)"
Freelance:  "Projet client retail : réduction 35% churn, économie 2M€/an"
```

**CTA Contact**
```
CDI:        "Me contacter pour une opportunité"
Freelance:  "Demander un audit gratuit"
```

---

## 3. Frontend React - Détails

### 🎨 Architecture Frontend

```
src/
├── components/
│   ├── Hero.jsx              # Hero section avec mode switch
│   ├── ModeToggle.jsx        # Toggle CDI/Freelance
│   ├── Timeline.jsx          # Parcours professionnel animé
│   ├── ProjectCard.jsx       # Card projet individuel
│   ├── ProjectGrid.jsx       # Grid responsive de projets
│   ├── BlogCard.jsx          # Card article de blog
│   ├── Skills.jsx            # Visualisation compétences
│   ├── Testimonials.jsx      # Carousel témoignages
│   ├── ContactForm.jsx       # Formulaire avec validation
│   ├── Analytics.jsx         # Dashboard analytics (admin)
│   └── Navbar.jsx            # Navigation + mode indicator
│
├── pages/
│   ├── Home.jsx              # Page d'accueil
│   ├── Projects.jsx          # Liste complète projets
│   ├── ProjectDetail.jsx     # Détail d'un projet
│   ├── Blog.jsx              # Liste articles
│   ├── BlogPost.jsx          # Article complet
│   ├── About.jsx             # À propos / Timeline
│   └── Contact.jsx           # Page contact
│
├── context/
│   ├── ModeContext.jsx       # Context pour dual-mode
│   └── AnalyticsContext.jsx  # Context pour tracking
│
├── services/
│   └── api.js                # Axios wrapper pour API calls
│
├── utils/
│   ├── formatters.js         # Formatage dates, nombres
│   └── validators.js         # Validation formulaires
│
└── App.jsx                   # Router et providers
```

### 🔧 Composants Clés

#### 1. **ModeToggle Component**

```jsx
// ModeToggle.jsx
import { useMode } from '../context/ModeContext';
import { trackEvent } from '../services/api';

export default function ModeToggle() {
  const { currentMode, switchMode, modes } = useMode();

  const handleSwitch = async (newMode) => {
    const oldMode = currentMode;
    switchMode(newMode);

    // Track analytics
    await trackEvent({
      event_type: 'mode_switch',
      event_data: { from: oldMode, to: newMode }
    });
  };

  return (
    <div className="flex gap-2">
      {modes.map(mode => (
        <button
          key={mode.key}
          onClick={() => handleSwitch(mode.key)}
          className={`px-4 py-2 rounded ${
            currentMode === mode.key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          {mode.display_name}
        </button>
      ))}
    </div>
  );
}
```

**Features** :
- Switch instantané sans rechargement
- Animation smooth de transition
- Tracking automatique du switch
- Indicateur visuel du mode actif
- Responsive mobile

#### 2. **Hero Component**

```jsx
// Hero.jsx
import { useState, useEffect } from 'react';
import { useMode } from '../context/ModeContext';
import { getContent } from '../services/api';

export default function Hero() {
  const { currentMode } = useMode();
  const [profile, setProfile] = useState(null);
  const [heroPitch, setHeroPitch] = useState('');

  useEffect(() => {
    loadHeroContent();
  }, [currentMode]); // Re-fetch when mode changes

  const loadHeroContent = async () => {
    const profileData = await getContent('profile');
    const pitch = await getContent('hero_pitch', currentMode);
    setProfile(profileData);
    setHeroPitch(pitch);
  };

  return (
    <section className="hero bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-20">
        <img src={profile?.photo_url} className="w-32 h-32 rounded-full" />
        <h1 className="text-5xl font-bold text-white mt-4">
          {profile?.full_name}
        </h1>
        <h2 className="text-2xl text-blue-100 mt-2">
          {profile?.title}
        </h2>
        <p className="text-xl text-white mt-6 max-w-2xl">
          {heroPitch}
        </p>
        <div className="mt-8 flex gap-4">
          <button className="btn-primary">
            {currentMode === 'cdi' ? 'Télécharger CV' : 'Demander un devis'}
          </button>
          <button className="btn-secondary">Voir mes projets</button>
        </div>
      </div>
    </section>
  );
}
```

**Features** :
- Contenu adapté au mode (hero_pitch, CTA)
- Animations d'apparition (Framer Motion)
- Gradient de couleur selon mode
- Responsive multi-device
- Photo de profil dynamique

#### 3. **ProjectCard Component**

```jsx
// ProjectCard.jsx
import { trackEvent } from '../services/api';

export default function ProjectCard({ project }) {
  const handleClick = async () => {
    await trackEvent({
      event_type: 'project_click',
      event_data: { project_id: project.id, project_slug: project.slug }
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
    >
      <h3 className="text-2xl font-bold">{project.title}</h3>
      <p className="text-gray-600 mt-2">{project.short_description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {project.tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-500">
          {project.github_language}
        </span>
        <span className="flex items-center gap-1">
          ⭐ {project.github_stars}
        </span>
      </div>
    </div>
  );
}
```

**Features** :
- Click tracking automatique
- Tags tech colorés
- GitHub stats (stars, language)
- Hover effect smooth
- Responsive grid

#### 4. **Timeline Component**

```jsx
// Timeline.jsx
import { useEffect, useState } from 'react';
import { getTimeline } from '../services/api';
import { motion } from 'framer-motion';

export default function Timeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    const data = await getTimeline();
    setEvents(data);
  };

  return (
    <section className="timeline py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Mon Parcours</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200" />

        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`flex items-center mb-8 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className="w-1/2 px-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
                <h3 className="text-xl font-bold mt-2">{event.title}</h3>
                <p className="text-gray-600 mt-2">{event.description}</p>

                {event.metrics && (
                  <div className="flex gap-4 mt-4">
                    {Object.entries(event.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{value}</div>
                        <div className="text-sm text-gray-500">{key}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline dot */}
            <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow z-10" />

            <div className="w-1/2" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

**Features** :
- Animations d'apparition au scroll (Framer Motion)
- Ligne verticale centrale
- Layout alterné gauche/droite
- Métriques par événement (projets réalisés, heures de formation, etc.)
- Dates formatées en français
- Responsive (vertical sur mobile)

### 🎯 State Management

#### ModeContext

```jsx
// context/ModeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { getModes } from '../services/api';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [currentMode, setCurrentMode] = useState('cdi');
  const [modes, setModes] = useState([]);

  useEffect(() => {
    loadModes();
  }, []);

  const loadModes = async () => {
    const data = await getModes();
    setModes(data);
  };

  const switchMode = (newMode) => {
    setCurrentMode(newMode);
    // Save preference to localStorage
    localStorage.setItem('preferredMode', newMode);
  };

  return (
    <ModeContext.Provider value={{ currentMode, modes, switchMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
```

### 📱 Responsive Design

**Breakpoints Tailwind** :
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)
```

**Exemples** :
```jsx
{/* Hero : texte centré sur mobile, gauche sur desktop */}
<h1 className="text-3xl md:text-5xl text-center md:text-left">

{/* Grid projets : 1 col mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{/* Timeline : vertical sur mobile, alterné sur desktop */}
<div className="flex flex-col lg:flex-row">
```

---

## 4. Backend FastAPI - Détails

### ⚙️ Architecture Backend

```python
# main.py structure
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncpg
from typing import Optional, List
from pydantic import BaseModel

app = FastAPI(title="Portfolio API", version="3.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection pool
async def get_db_pool():
    return await asyncpg.create_pool(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        min_size=5,
        max_size=20
    )

pool = None

@app.on_event("startup")
async def startup():
    global pool
    pool = await get_db_pool()

@app.on_event("shutdown")
async def shutdown():
    await pool.close()
```

### 📦 Pydantic Models

```python
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class Profile(BaseModel):
    id: int
    full_name: str
    title: str
    bio: str
    hero_pitch: str
    email: EmailStr
    linkedin_url: Optional[str]
    github_url: Optional[str]
    photo_url: Optional[str]

class TimelineEvent(BaseModel):
    id: int
    date: datetime
    title: str
    description: str
    category: str  # 'formation', 'alternance', 'commercial'
    metrics: Optional[Dict[str, Any]]

class Project(BaseModel):
    id: int
    slug: str
    title: str
    short_description: str
    long_description: Optional[str]
    category: str
    tags: List[str]
    github_url: str
    github_stars: int
    github_language: str
    demo_url: Optional[str]
    featured: bool
    target_modes: List[str]
    status: str

class AnalyticsEvent(BaseModel):
    event_type: str
    event_data: Optional[Dict[str, Any]]
    referrer: Optional[str]
    user_agent: Optional[str]

    @validator('event_type')
    def validate_event_type(cls, v):
        allowed = ['page_view', 'project_click', 'mode_switch', 'contact_submit', 'cv_download']
        if v not in allowed:
            raise ValueError(f'event_type must be one of {allowed}')
        return v

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    mode: str

    @validator('message')
    def validate_message(cls, v):
        if len(v) < 20:
            raise ValueError('Message must be at least 20 characters')
        return v
```

### 🔌 Endpoints Détaillés

#### Endpoint: GET /api/profile

```python
@app.get("/api/profile", response_model=Profile)
async def get_profile():
    """
    Récupère le profil utilisateur.

    Returns:
        Profile: Données de profil complètes
    """
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            SELECT id, full_name, title, bio, hero_pitch,
                   email, linkedin_url, github_url, photo_url
            FROM profile
            LIMIT 1
        """)

        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")

        return dict(row)
```

#### Endpoint: GET /api/mode-projects

```python
@app.get("/api/mode-projects", response_model=List[Project])
async def get_mode_projects(
    mode: str = Query(..., regex="^(cdi|freelance)$"),
    featured_only: bool = Query(False),
    limit: int = Query(10, ge=1, le=50)
):
    """
    Récupère les projets adaptés au mode sélectionné avec content overrides appliqués.

    Args:
        mode: Mode actuel (cdi ou freelance)
        featured_only: Ne retourner que les projets featured
        limit: Nombre max de résultats

    Returns:
        List[Project]: Projets avec contenu adapté au mode
    """
    async with pool.acquire() as conn:
        # Base query
        query = """
            SELECT
                p.*,
                COALESCE(
                    (SELECT override_value
                     FROM mode_content_overrides
                     WHERE mode_key = $1
                       AND content_type = 'project'
                       AND content_id = p.id
                       AND override_field = 'short_description'),
                    p.short_description
                ) as short_description
            FROM projects p
            WHERE $1 = ANY(p.target_modes)
              AND p.status = 'published'
        """

        if featured_only:
            query += " AND p.featured = true"

        query += " ORDER BY p.mode_priority DESC, p.created_at DESC LIMIT $2"

        rows = await conn.fetch(query, mode, limit)
        return [dict(row) for row in rows]
```

#### Endpoint: POST /api/analytics/event

```python
@app.post("/api/analytics/event")
async def track_event(
    event: AnalyticsEvent,
    request: Request
):
    """
    Track un événement analytics.

    Args:
        event: Données de l'événement
        request: Request FastAPI (pour IP, user-agent)

    Returns:
        dict: Confirmation avec event_id
    """
    async with pool.acquire() as conn:
        # Get or create session
        session_id = request.cookies.get('session_id') or str(uuid.uuid4())

        await conn.execute("""
            INSERT INTO visitor_sessions (session_id, ip_address, user_agent, referrer, last_updated)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (session_id)
            DO UPDATE SET last_updated = NOW()
        """, session_id, request.client.host, request.headers.get('user-agent'), event.referrer)

        # Insert event
        event_id = await conn.fetchval("""
            INSERT INTO analytics_events (
                session_id, event_type, event_data,
                referrer, user_agent, ip_address
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        """,
            session_id,
            event.event_type,
            json.dumps(event.event_data) if event.event_data else None,
            event.referrer,
            request.headers.get('user-agent'),
            request.client.host
        )

        return {"success": True, "event_id": event_id, "session_id": session_id}
```

#### Endpoint: GET /api/analytics/summary

```python
@app.get("/api/analytics/summary")
async def get_analytics_summary(
    days: int = Query(7, ge=1, le=90)
):
    """
    Résumé analytics sur N jours.

    Args:
        days: Nombre de jours à analyser

    Returns:
        dict: Métriques agrégées
    """
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            WITH stats AS (
                SELECT
                    COUNT(DISTINCT session_id) as unique_visitors,
                    COUNT(*) as total_events,
                    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
                    COUNT(*) FILTER (WHERE event_type = 'project_click') as project_clicks,
                    COUNT(*) FILTER (WHERE event_type = 'mode_switch') as mode_switches,
                    COUNT(*) FILTER (WHERE event_type = 'contact_submit') as contacts
                FROM analytics_events
                WHERE timestamp >= NOW() - INTERVAL '$1 days'
            )
            SELECT * FROM stats
        """, days)

        return {
            "period_days": days,
            "unique_visitors": row['unique_visitors'],
            "total_events": row['total_events'],
            "page_views": row['page_views'],
            "project_clicks": row['project_clicks'],
            "mode_switches": row['mode_switches'],
            "contacts": row['contacts'],
            "engagement_rate": round(row['project_clicks'] / row['page_views'] * 100, 2) if row['page_views'] > 0 else 0
        }
```

### 🔒 Security

#### Rate Limiting (à implémenter)

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/contact")
@limiter.limit("5/minute")  # Max 5 contacts par minute
async def submit_contact(request: Request, contact: ContactSubmission):
    # ...
```

#### Input Validation

Pydantic gère automatiquement :
- Type checking
- Email validation
- String length limits
- Custom validators

#### SQL Injection Prevention

asyncpg utilise des prepared statements :
```python
# ✅ SAFE - Parameterized query
await conn.fetch("SELECT * FROM users WHERE id = $1", user_id)

# ❌ DANGER - String interpolation
await conn.fetch(f"SELECT * FROM users WHERE id = {user_id}")
```

---

## 5. Automation n8n - Détails

### 🤖 Workflow 1: GitHub Portfolio Sync

**Objectif** : Scanner GitHub toutes les 6h, générer des résumés avec IA, insérer en DB.

#### Nodes du Workflow

```
1. Schedule Trigger (Cron: 0 */6 * * *)
    ↓
2. HTTP Request (MCP Sidecar)
   GET http://sidecar:8080/mcp/tools
    ↓
3. Function: Parse repos
   Extract repos with >5 stars or updated last 7 days
    ↓
4. Loop: For each repo
    ├─→ HTTP Request: Read README
    │   POST http://sidecar:8080/mcp/call
    │   Body: {"tool": "github.read_readme", "args": {...}}
    │    ↓
    ├─→ HTTP Request: Generate summary with Ollama
    │   POST http://ollama:11434/api/generate
    │   Model: mistral:instruct
    │   Prompt: See prompts/summarize_project.md
    │    ↓
    ├─→ Function: Calculate confidence score
    │   Check keywords, length, structure → score 0-100
    │    ↓
    └─→ PostgreSQL: Insert or Update
        INSERT INTO projects (...)
        ON CONFLICT (github_url) DO UPDATE ...
    ↓
5. If confidence < 80%
    ├─→ Slack Notification
    │   "⚠️ New project needs review: {title}"
    │   Link to project in DB
    │
    └─→ Email Notification (optional)
```

#### Prompt Ollama

```markdown
# prompts/summarize_project.md

You are a professional portfolio writer. Generate a concise, impactful project description.

## Project Info
- Name: {{repo_name}}
- Language: {{language}}
- Stars: {{stars}}
- README:
{{readme_content}}

## Instructions
1. Extract the project's main purpose (1 sentence)
2. List 3-5 key technical features
3. Identify the tech stack
4. Suggest relevant tags (5-7 tags)
5. Write a short pitch (CV-ready, 2 sentences)

## Output Format (JSON)
{
  "title": "Catchy project title",
  "short_description": "One-liner for CV",
  "long_description": "2-3 paragraphs with details",
  "tags": ["Python", "ML", "Docker", ...],
  "tech_stack": ["FastAPI", "PostgreSQL", ...],
  "category": "Machine Learning" | "Web Development" | "Data Engineering" | ...,
  "business_impact": "Optional: measurable impact if mentioned"
}
```

#### Confidence Score Logic

```javascript
// Function node: Calculate confidence
function calculateConfidence(summary, readme) {
  let score = 50; // Base score

  // Length checks
  if (summary.short_description.length >= 50) score += 10;
  if (summary.long_description.length >= 200) score += 10;

  // Tags check
  if (summary.tags && summary.tags.length >= 5) score += 10;

  // README quality
  if (readme.length > 500) score += 10;
  if (readme.includes('## Installation')) score += 5;
  if (readme.includes('## Usage')) score += 5;

  // Tech stack mentioned
  if (summary.tech_stack && summary.tech_stack.length >= 3) score += 10;

  // Business impact (bonus)
  if (summary.business_impact) score += 5;

  return Math.min(score, 100);
}
```

### 🔔 Workflow 2: Visitor Notifications

**Objectif** : Alerter toutes les 15min des nouveaux visiteurs.

```
1. Schedule Trigger (Cron: */15 * * * *)
    ↓
2. PostgreSQL: Query new sessions
   SELECT * FROM visitor_sessions
   WHERE created_at >= NOW() - INTERVAL '15 minutes'
    ↓
3. If: Count > 0
    ├─→ Function: Format notification
    │   "🔔 3 new visitors in last 15min
    │    • 2 from Google Search
    │    • 1 from LinkedIn
    │    Landing page: /projects (2), /blog (1)"
    │    ↓
    ├─→ Slack Webhook
    │   POST https://hooks.slack.com/services/...
    │    ↓
    └─→ Telegram Bot (optional)
        POST https://api.telegram.org/bot{token}/sendMessage
```

### 📊 Workflow 3: Analytics Daily Digest

**Objectif** : Envoyer un rapport quotidien à 9h.

```
1. Schedule Trigger (Cron: 0 9 * * *)
    ↓
2. PostgreSQL: Query yesterday's stats
   SELECT * FROM analytics_daily_summary
   WHERE date = CURRENT_DATE - 1
    ↓
3. PostgreSQL: Query top projects
   SELECT p.title, COUNT(*) as clicks
   FROM analytics_events ae
   JOIN projects p ON (ae.event_data->>'project_id')::int = p.id
   WHERE event_type = 'project_click'
     AND date = CURRENT_DATE - 1
   GROUP BY p.title
   ORDER BY clicks DESC
   LIMIT 5
    ↓
4. Function: Generate HTML email
   Template with stats, charts (Chart.js), top projects
    ↓
5. Email (SMTP)
   To: votre-email@gmail.com
   Subject: "📊 Portfolio Daily Digest - {date}"
   Body: HTML template
```

### 🔍 Workflow 4: Content Review Alerts

**Objectif** : Rappeler le contenu à valider toutes les 12h.

```
1. Schedule Trigger (Cron: 0 */12 * * *)
    ↓
2. PostgreSQL: Query pending content
   - Projects with ai_confidence_score < 80
   - Blog posts in draft status
   - Testimonials not validated
    ↓
3. If: Pending items exist
    ├─→ Function: Format checklist
    │   "📝 Content Review Needed:
    │
    │    Projects (2):
    │    • Project A (confidence: 65%) - [Review](link)
    │    • Project B (confidence: 72%) - [Review](link)
    │
    │    Blog Posts (1):
    │    • Draft: How to deploy ML models
    │
    │    Testimonials (3):
    │    • Pending validation from John Doe"
    │    ↓
    └─→ Slack Notification
        POST to #portfolio-review channel
```

### 🛠️ Configuration n8n

#### Credentials à configurer

**PostgreSQL**
```
Host: db (nom du service Docker)
Port: 5432
Database: n8n_database
User: admin_user_db
Password: (voir .env)
SSL: Disabled (internal network)
```

**Ollama**
```
Base URL: http://ollama:11434
Model: mistral:instruct
Max Tokens: 2000
Temperature: 0.7
```

**Slack Webhook**
```
Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Email (SMTP)**
```
Host: smtp.gmail.com
Port: 587
User: votre-email@gmail.com
Password: App Password (not your Gmail password!)
Secure: TLS
```

---

## 6. Intelligence Artificielle

### 🧠 Ollama : LLM Local

#### Pourquoi Local ?

**Avantages** :
- ✅ **Gratuit** : Pas de coûts API OpenAI/Anthropic
- ✅ **Privé** : Données ne sortent pas du serveur
- ✅ **Rapide** : Pas de latence réseau
- ✅ **Hors ligne** : Fonctionne sans internet

**Inconvénients** :
- ❌ **Resources** : Nécessite CPU/RAM (8GB+ RAM recommandé)
- ❌ **Qualité** : Légèrement inférieure à GPT-4
- ❌ **Maintenance** : Gérer les modèles manuellement

#### Modèles Recommandés

| Modèle | Taille | RAM | Use Case |
|--------|--------|-----|----------|
| **llama3.2:1b** | 1.3GB | 2GB | Résumés rapides, tests |
| **mistral:instruct** | 4.1GB | 8GB | Production, qualité/vitesse équilibrée |
| **llama3.1:8b** | 4.7GB | 8GB | Meilleure qualité, plus lent |
| **codellama:13b** | 7.4GB | 16GB | Code analysis, tech projects |

#### Installation et Pull

```bash
# Installer Ollama localement (optionnel, déjà dans Docker)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull un modèle
docker exec ollama ollama pull mistral:instruct

# Lister les modèles installés
docker exec ollama ollama list

# Tester un modèle
docker exec -it ollama ollama run mistral:instruct
>>> Résume ce projet GitHub : [paste README]
```

#### API Usage

```bash
# Generate (streaming)
curl http://localhost:11434/api/generate -d '{
  "model": "mistral:instruct",
  "prompt": "Résume ce projet en 2 phrases : [README]",
  "stream": false
}'

# Chat (conversational)
curl http://localhost:11434/api/chat -d '{
  "model": "mistral:instruct",
  "messages": [
    {"role": "system", "content": "Tu es un rédacteur de portfolio professionnel."},
    {"role": "user", "content": "Résume ce projet : ..."}
  ]
}'
```

### 🎯 Prompts Engineering

#### Prompt: Résumé Projet

```markdown
Tu es un expert en rédaction de portfolio professionnel pour développeurs.

## Contexte
Nom du projet : {{repo_name}}
Langage principal : {{language}}
Stars GitHub : {{stars}}
README :
```
{{readme_content}}
```

## Tâche
Génère une description professionnelle de ce projet pour un portfolio.

## Format de sortie (JSON strict)
{
  "title": "Titre accrocheur (5-8 mots)",
  "short_description": "Pitch CV (1 phrase, 15-20 mots)",
  "long_description": "Description détaillée (2-3 paragraphes, 100-150 mots)",
  "tags": ["Python", "FastAPI", "ML", ...],  // 5-7 tags
  "category": "Machine Learning",  // Catégorie principale
  "tech_stack": ["FastAPI", "PostgreSQL", "Docker"],  // Technologies utilisées
  "business_impact": "Impact mesurable si mentionné dans le README, sinon null"
}

## Consignes
1. Priorise les résultats business sur les détails techniques
2. Utilise un ton professionnel mais accessible
3. Mets en avant l'innovation et la valeur ajoutée
4. Sois concis et percutant
5. N'invente pas d'informations absentes du README
```

#### Prompt: Validation Publish

```markdown
Tu es un reviewer de contenu portfolio.

## Contenu à valider
```json
{{project_summary}}
```

## Critères de validation
1. **Clarté** : Le pitch est-il compréhensible en 5 secondes ?
2. **Précision** : Les infos sont-elles exactes et vérifiables ?
3. **Impact** : La valeur ajoutée est-elle claire ?
4. **Technique** : Le niveau technique est-il adapté à l'audience ?
5. **Tags** : Les tags sont-ils pertinents et recherchés ?

## Scoring
Attribue un score de 0 à 100 pour chaque critère, puis une moyenne globale.

## Output (JSON)
{
  "scores": {
    "clarity": 85,
    "accuracy": 90,
    "impact": 75,
    "technical": 80,
    "tags": 85
  },
  "overall_score": 83,
  "feedback": "Suggestions d'amélioration...",
  "auto_publish": true  // if overall_score >= 80
}
```

### 📊 Confidence Scoring Algorithm

```python
def calculate_ai_confidence(
    summary: dict,
    readme: str,
    ollama_response_time: float
) -> int:
    """
    Calcule un score de confiance (0-100) pour un résumé généré par IA.

    Args:
        summary: Résumé JSON généré par Ollama
        readme: Contenu original du README
        ollama_response_time: Temps de réponse Ollama (secondes)

    Returns:
        int: Score 0-100 (80+ = auto-publish)
    """
    score = 50  # Base

    # 1. Completeness check (max +20)
    required_fields = ['title', 'short_description', 'long_description', 'tags', 'category']
    completeness = sum(1 for f in required_fields if f in summary and summary[f]) / len(required_fields)
    score += int(completeness * 20)

    # 2. Length validation (max +15)
    if len(summary.get('short_description', '')) >= 50:
        score += 5
    if 100 <= len(summary.get('long_description', '')) <= 500:
        score += 10

    # 3. Tags quality (max +10)
    tags_count = len(summary.get('tags', []))
    if 5 <= tags_count <= 10:
        score += 10
    elif tags_count >= 3:
        score += 5

    # 4. README richness (max +10)
    if len(readme) > 1000:
        score += 5
    if '## Installation' in readme and '## Usage' in readme:
        score += 5

    # 5. Business impact (bonus +5)
    if summary.get('business_impact'):
        score += 5

    # 6. Response time penalty (max -10)
    if ollama_response_time > 30:  # Plus de 30s = trop lent
        score -= 10
    elif ollama_response_time > 15:
        score -= 5

    return max(0, min(100, score))
```

---

## 7. Analytics & Tracking

### 📊 Event Types

```typescript
type EventType =
  | 'page_view'        // Page visitée
  | 'project_click'    // Clic sur un projet
  | 'mode_switch'      // Toggle CDI ↔ Freelance
  | 'contact_submit'   // Soumission formulaire contact
  | 'cv_download'      // Téléchargement CV
  | 'blog_read'        // Article lu (scroll >50%)
  | 'external_link'    // Clic sur lien externe (GitHub, LinkedIn)
  | 'share'            // Partage sur réseaux sociaux

interface AnalyticsEvent {
  event_type: EventType;
  event_data: {
    page?: string;
    project_id?: number;
    project_slug?: string;
    from_mode?: 'cdi' | 'freelance';
    to_mode?: 'cdi' | 'freelance';
    blog_slug?: string;
    read_percentage?: number;
    external_url?: string;
    [key: string]: any;
  };
  referrer?: string;
  user_agent?: string;
}
```

### 📈 Metrics Calculées

#### Engagement Rate

```sql
-- Taux d'engagement = (clics projets) / (page views) * 100
SELECT
  COUNT(*) FILTER (WHERE event_type = 'project_click') * 100.0 /
  COUNT(*) FILTER (WHERE event_type = 'page_view') as engagement_rate
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '7 days';
```

#### Conversion Rate by Mode

```sql
-- Taux de conversion = (contacts) / (visiteurs uniques) * 100 par mode
WITH conversions AS (
  SELECT
    session_id,
    event_data->>'mode' as mode,
    COUNT(*) FILTER (WHERE event_type = 'contact_submit') as converted
  FROM analytics_events
  WHERE timestamp >= NOW() - INTERVAL '30 days'
  GROUP BY session_id, mode
)
SELECT
  mode,
  COUNT(DISTINCT session_id) as total_visitors,
  COUNT(*) FILTER (WHERE converted > 0) as conversions,
  (COUNT(*) FILTER (WHERE converted > 0) * 100.0 / COUNT(DISTINCT session_id)) as conversion_rate
FROM conversions
GROUP BY mode;
```

#### Bounce Rate

```sql
-- Bounce rate = sessions avec 1 seule page view
WITH session_pages AS (
  SELECT
    session_id,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views
  FROM analytics_events
  WHERE timestamp >= NOW() - INTERVAL '7 days'
  GROUP BY session_id
)
SELECT
  (COUNT(*) FILTER (WHERE page_views = 1) * 100.0 / COUNT(*)) as bounce_rate
FROM session_pages;
```

#### Average Session Duration

```sql
-- Durée moyenne de session
SELECT
  AVG(EXTRACT(EPOCH FROM (last_updated - created_at))) / 60 as avg_duration_minutes
FROM visitor_sessions
WHERE created_at >= NOW() - INTERVAL '7 days';
```

### 🎯 Conversion Goals

```sql
-- Table: conversion_goals
CREATE TABLE conversion_goals (
  id SERIAL PRIMARY KEY,
  mode_key VARCHAR(50),         -- 'cdi' ou 'freelance'
  goal_name VARCHAR(100),        -- 'cv_download', 'contact_submit', etc.
  goal_description TEXT,
  target_value INTEGER,          -- Objectif (ex: 50 CV downloads/mois)
  current_value INTEGER DEFAULT 0,
  period VARCHAR(20) DEFAULT 'monthly',  -- 'daily', 'weekly', 'monthly'
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exemples de goals
INSERT INTO conversion_goals (mode_key, goal_name, target_value, period) VALUES
('cdi', 'cv_download', 100, 'monthly'),
('freelance', 'contact_submit', 20, 'monthly'),
('both', 'engagement_rate', 30, 'monthly');  -- 30% engagement
```

### 📊 Analytics Dashboard (Admin)

**React Component: AnalyticsDashboard.jsx**

```jsx
import { useState, useEffect } from 'react';
import { getAnalyticsSummary, getModeComparison } from '../services/api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [modeComparison, setModeComparison] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const summaryData = await getAnalyticsSummary(30);  // 30 derniers jours
    const comparisonData = await getModeComparison();
    setSummary(summaryData);
    setModeComparison(comparisonData);
  };

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="analytics-dashboard p-8">
      <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Visiteurs Uniques"
          value={summary.unique_visitors}
          trend="+12%"
          icon="👥"
        />
        <KPICard
          title="Page Views"
          value={summary.page_views}
          trend="+8%"
          icon="👁️"
        />
        <KPICard
          title="Engagement Rate"
          value={`${summary.engagement_rate}%`}
          trend="+5%"
          icon="🎯"
        />
        <KPICard
          title="Conversions"
          value={summary.contacts}
          trend="+25%"
          icon="📧"
        />
      </div>

      {/* Mode Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">CDI vs Freelance Performance</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-600">Mode CDI</h3>
            <p>Visiteurs: {modeComparison.cdi.visitors}</p>
            <p>Conversions: {modeComparison.cdi.conversions}</p>
            <p>Taux: {modeComparison.cdi.conversion_rate}%</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-600">Mode Freelance</h3>
            <p>Visiteurs: {modeComparison.freelance.visitors}</p>
            <p>Conversions: {modeComparison.freelance.conversions}</p>
            <p>Taux: {modeComparison.freelance.conversion_rate}%</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Traffic Sources</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={summary.traffic_sources}
              dataKey="value"
              nameKey="name"
              fill="#3B82F6"
            />
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Top Projets</h3>
          <BarChart width={400} height={300} data={summary.top_projects}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="clicks" fill="#10B981" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Base de Données

### 🗄️ Schéma Complet

#### Phase 1 Tables

**profile**
```sql
CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  title VARCHAR(200),
  bio TEXT,
  hero_pitch TEXT,
  email VARCHAR(200),
  phone VARCHAR(50),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  twitter_url VARCHAR(500),
  photo_url VARCHAR(500),
  cv_url VARCHAR(500),
  availability VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**timeline_events**
```sql
CREATE TABLE timeline_events (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),  -- 'formation', 'alternance', 'commercial'
  metrics JSONB,         -- {"projects": 5, "hours": 200}
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**skills**
```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),   -- 'technical', 'business', 'soft'
  level INTEGER CHECK (level >= 1 AND level <= 5),
  is_primary BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0
);
```

#### Phase 2 Tables

**projects**
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  short_description TEXT,
  long_description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  tech_stack TEXT[],
  github_url VARCHAR(500),
  github_stars INTEGER DEFAULT 0,
  github_forks INTEGER DEFAULT 0,
  github_language VARCHAR(50),
  demo_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  target_modes TEXT[] DEFAULT ARRAY['cdi', 'freelance'],
  mode_priority INTEGER DEFAULT 50,
  status VARCHAR(50) DEFAULT 'draft',
  ai_confidence_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**blog_posts**
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(300) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,          -- Markdown content
  category VARCHAR(100),
  tags TEXT[],
  published_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  read_time_minutes INTEGER,
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  target_modes TEXT[] DEFAULT ARRAY['cdi', 'freelance']
);
```

#### Phase 3 Tables

**portfolio_modes**
```sql
CREATE TABLE portfolio_modes (
  id SERIAL PRIMARY KEY,
  mode_key VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  description TEXT,
  hero_cta_text VARCHAR(200),
  hero_cta_url VARCHAR(500),
  color_primary VARCHAR(20),
  color_secondary VARCHAR(20),
  conversion_goal VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**mode_content_overrides**
```sql
CREATE TABLE mode_content_overrides (
  id SERIAL PRIMARY KEY,
  mode_key VARCHAR(50) REFERENCES portfolio_modes(mode_key),
  content_type VARCHAR(50),  -- 'profile', 'project', 'blog'
  content_id INTEGER,
  override_field VARCHAR(100),
  override_value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(mode_key, content_type, content_id, override_field)
);
```

**analytics_events**
```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW(),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(50),
  mode VARCHAR(50)
);

CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
```

**visitor_sessions**
```sql
CREATE TABLE visitor_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT,
  referrer TEXT,
  landing_mode VARCHAR(50),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  country VARCHAR(100),
  city VARCHAR(100)
);
```

### 📊 Views & Aggregations

**mode_performance_comparison**
```sql
CREATE VIEW mode_performance_comparison AS
SELECT
  mode,
  COUNT(DISTINCT session_id) as total_visitors,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'project_click') as project_clicks,
  COUNT(*) FILTER (WHERE event_type = 'contact_submit') as conversions,
  (COUNT(*) FILTER (WHERE event_type = 'contact_submit') * 100.0 /
   COUNT(DISTINCT session_id)) as conversion_rate,
  (COUNT(*) FILTER (WHERE event_type = 'project_click') * 100.0 /
   COUNT(*) FILTER (WHERE event_type = 'page_view')) as engagement_rate
FROM analytics_events
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY mode;
```

**analytics_daily_summary**
```sql
CREATE VIEW analytics_daily_summary AS
SELECT
  DATE(timestamp) as date,
  COUNT(DISTINCT session_id) as unique_visitors,
  COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
  COUNT(*) FILTER (WHERE event_type = 'project_click') as project_clicks,
  COUNT(*) FILTER (WHERE event_type = 'contact_submit') as contacts,
  AVG((event_data->>'read_percentage')::int) FILTER (WHERE event_type = 'blog_read') as avg_blog_read_pct
FROM analytics_events
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### 🔄 Triggers

**Auto-update timestamps**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... idem pour toutes les tables avec updated_at
```

---

## 9. Workflow Complet

### 🔄 Cycle de Vie d'un Projet

```
┌──────────────────┐
│  GitHub Commit   │
│   New Project    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│ n8n Workflow (triggered every 6h│
│ or manual webhook)              │
└────────┬────────────────────────┘
         │
         ▼
┌────────────────────┐
│  MCP Sidecar       │
│  Fetch repos list  │
└────────┬───────────┘
         │
         ▼
┌───────────────────────────────┐
│  Filter repos:                │
│  - Recent (last 7 days) OR    │
│  - Popular (>5 stars)         │
└────────┬──────────────────────┘
         │
         ▼
┌───────────────────┐
│  Read README      │
│  (GitHub API)     │
└────────┬──────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Ollama LLM                     │
│  Generate summary with prompt   │
│  (title, description, tags)     │
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Calculate           │
│  Confidence Score    │
│  (0-100)             │
└────────┬─────────────┘
         │
         ├─ Score < 80% ──────────┐
         │                        │
         │                        ▼
         │              ┌────────────────────┐
         │              │ Slack Notification │
         │              │ "Need Review"      │
         │              └────────────────────┘
         │                        │
         │                        ▼
         │              ┌────────────────────┐
         │              │ Human Validation   │
         │              │ (edit in DB)       │
         │              └────────────────────┘
         │
         ├─ Score ≥ 80% ──────────┐
         │                        │
         ▼                        ▼
┌────────────────────┐  ┌────────────────────┐
│ Insert PostgreSQL  │  │ Status: published  │
│ (or UPDATE)        │  │ Auto-publish       │
└────────┬───────────┘  └────────────────────┘
         │
         ▼
┌────────────────────┐
│ API Endpoint       │
│ GET /api/projects  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Frontend React     │
│ Display project    │
│ on portfolio       │
└────────────────────┘
```

### 👤 Parcours Visiteur Typique

**Scénario 1 : Recruteur (Mode CDI)**

```
1. Arrive sur homepage via Google Search
   → Track: page_view + new session

2. Lit le hero pitch "Data Scientist en alternance..."
   → Mode CDI par défaut

3. Scroll timeline : voit parcours académique + alternance
   → Track: scroll_depth: 50%

4. Clique sur projet "Churn Prediction ML"
   → Track: project_click
   → Voit description technique détaillée

5. Clique sur GitHub link du projet
   → Track: external_link (GitHub)

6. Retour sur portfolio, va sur /blog
   → Track: page_view (/blog)

7. Lit article "Comment j'ai appris le ML"
   → Track: blog_read (80% lu)

8. Va sur /contact
   → Track: page_view (/contact)

9. Télécharge CV en PDF
   → Track: cv_download
   → CONVERSION GOAL atteint !

10. Remplit formulaire contact
    → Track: contact_submit
    → Email envoyé au propriétaire du portfolio
    → Session terminée
```

**Scénario 2 : Client Freelance (Mode Freelance)**

```
1. Arrive sur homepage via LinkedIn
   → Track: page_view + new session
   → Referrer: linkedin.com

2. Toggle vers "Mode Freelance"
   → Track: mode_switch (cdi → freelance)
   → Hero pitch change: "Transformez vos données en ROI..."

3. Scroll projets : voit impact business
   → "Projet client retail : -35% churn, économie 2M€/an"

4. Clique sur projet
   → Track: project_click
   → Voit témoignage client + résultats chiffrés

5. Va sur /services (page Freelance uniquement)
   → Track: page_view (/services)
   → Voit packages de service + tarifs indicatifs

6. Utilise ROI Calculator
   → Track: roi_calculation
   → Input: volume données, coût actuel
   → Output: économies potentielles estimées

7. Va sur /contact
   → Track: page_view (/contact)
   → CTA adapté : "Demander un audit gratuit"

8. Remplit formulaire
   → Track: contact_submit (mode: freelance)
   → CONVERSION GOAL atteint !
   → Email envoyé avec contexte "demande freelance"
```

---

## 10. Cas d'Usage

### 🎓 Cas 1 : Étudiant en Reconversion

**Profil** : Ex-commercial, 28 ans, alternance Data Scientist (2e année)

**Objectifs** :
- Mode CDI : Décrocher premier CDI en Data Science
- Mode Freelance : Missions ponctuelles pendant recherche CDI

**Configuration** :

**Mode CDI prioritaire** :
```sql
-- Hero pitch mode CDI
UPDATE profile SET hero_pitch =
'Data Scientist en alternance avec background commercial.
Expert en vulgarisation de concepts ML/IA complexes pour audiences non-tech.';

-- Projets à mettre en avant (CDI)
INSERT INTO mode_content_overrides VALUES
('cdi', 'project', 1, 'short_description',
 'Modèle ML de prédiction de churn : 92% accuracy avec XGBoost, pipeline complet de preprocessing à deployment (Docker + FastAPI)');
```

**Mode Freelance secondaire** :
```sql
-- Hero pitch mode Freelance
INSERT INTO mode_content_overrides VALUES
('freelance', 'profile', 1, 'hero_pitch',
 'Freelance Data Science & IA : J''aide les PME à exploiter leurs données pour augmenter leur CA. Formation commerce + tech = double expertise.');

-- Même projet, angle business
INSERT INTO mode_content_overrides VALUES
('freelance', 'project', 1, 'short_description',
 'Projet client e-commerce : réduction 35% du churn grâce à un modèle prédictif ML. ROI : 2M€ économisés sur 1 an.');
```

**Analytics à surveiller** :
- Taux conversion CDI (cv_download)
- Engagement sur articles de blog "reconversion"
- Clics sur certifications

### 💼 Cas 2 : Freelance Confirmé

**Profil** : Data Engineer freelance, 5 ans d'expérience, cherche contrats longs

**Objectifs** :
- Mode Freelance prioritaire : Vendre services
- Mode CDI désactivé (ou minimal)

**Configuration** :

```sql
-- Désactiver mode CDI
UPDATE portfolio_modes SET is_active = false WHERE mode_key = 'cdi';

-- Mode Freelance only
UPDATE profile SET hero_pitch =
'Data Engineer Freelance : Je construis vos pipelines de données de A à Z.
+50 clients satisfaits, 95% de recommandations.';

-- Services page visible
INSERT INTO services (name, duration, price_range, description) VALUES
('Audit Data Infrastructure', '2-5 jours', '2000-5000€',
 'Analyse complète de votre stack data : architecture, performance, coûts, sécurité.'),
('Data Pipeline MVP', '2-4 semaines', '10000-20000€',
 'Développement d''un pipeline de données complet avec orchestration (Airflow/Prefect).'),
('Formation Équipe', '1 semaine', '5000€',
 'Formation sur mesure pour votre équipe : SQL avancé, Python data, CI/CD.');

-- Testimonials avec clients réels
INSERT INTO testimonials (author_name, author_role, quote) VALUES
('Jean Dupont', 'CTO - Startup Fintech',
 'Pipeline livré en 3 semaines, qualité irréprochable. Notre time-to-insight est passé de 3 jours à 1 heure.'),
('Marie Martin', 'Data Lead - Retail',
 'Audit très complet qui nous a permis de réduire nos coûts cloud de 40%. Recommande ++');
```

**Analytics à surveiller** :
- Taux conversion freelance (contact_submit)
- Clics sur "Demander un devis"
- Utilisation ROI calculator
- Pages vues /services

### 🚀 Cas 3 : Startup Founder

**Profil** : Développeur full-stack, lance sa startup SaaS, cherche investisseurs + early adopters

**Objectifs** :
- Mode CDI : Attirer talents tech pour rejoindre équipe
- Mode Freelance : Convertir early adopters (leads B2B)

**Configuration** :

```sql
-- Dual mode actif
UPDATE portfolio_modes SET is_active = true WHERE mode_key IN ('cdi', 'freelance');

-- Mode CDI = "Join Us"
INSERT INTO mode_content_overrides VALUES
('cdi', 'profile', 1, 'hero_pitch',
 'Founder & CTO @ [StartupName] - On recrute des devs passionnés ! Stack: React, FastAPI, PostgreSQL, AWS.'),
('cdi', 'profile', 1, 'hero_cta_text', 'Rejoindre l''aventure'),
('cdi', 'profile', 1, 'hero_cta_url', '/join-us');

-- Mode Freelance = "Try Our Product"
INSERT INTO mode_content_overrides VALUES
('freelance', 'profile', 1, 'hero_pitch',
 '[StartupName] : La plateforme SaaS qui automatise vos workflows data. Déjà +100 clients satisfaits.'),
('freelance', 'profile', 1, 'hero_cta_text', 'Essai gratuit 14 jours'),
('freelance', 'profile', 1, 'hero_cta_url', 'https://app.startup.com/signup');

-- Projets à mettre en avant
-- CDI : projets open source techniques
-- Freelance : case studies clients
```

**Analytics à surveiller** :
- Mode switch rate (combien toggle ?)
- Conversion CDI : clics "Join Us"
- Conversion Freelance : clics "Essai gratuit"
- Provenance traffic (Product Hunt, HN, LinkedIn)

---

## 🎉 Conclusion

Ce système Portfolio Automatisé Dual-Mode combine :

✅ **Automation** : GitHub → IA → Portfolio (sans intervention)
✅ **Intelligence** : Ollama LLM local pour génération contenu
✅ **Adaptabilité** : Dual-mode CDI/Freelance avec content overrides
✅ **Analytics** : Tracking granulaire et comparaison modes
✅ **Performance** : Stack moderne (React, FastAPI, PostgreSQL)
✅ **Extensibilité** : API-first, modulaire, open source

**Use Cases** :
- Développeurs en reconversion
- Freelances cherchant missions
- Étudiants en alternance
- Founders recrutant + vendant

**Prochaines étapes** :
1. Personnaliser les données de seed avec votre profil
2. Configurer GitHub token pour automation
3. Importer workflows n8n
4. Déployer en production

**Happy portfolio building! 🚀**
