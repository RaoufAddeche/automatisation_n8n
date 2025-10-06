# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated portfolio assistant system built with n8n, PostgreSQL, and Ollama. The system automatically tracks GitHub repositories, summarizes projects using LLMs, and maintains an up-to-date portfolio with human validation.

**User Profile**: Data Scientist in reconversion (ex-Commercial), 2nd year of alternance, 28 years old.

**Portfolio Objectives**:
1. **CDI Mode**: Showcase technical skills, projects, and career transition for recruiters
2. **Freelance Mode**: Present business-focused case studies, ROI, and services for potential clients

**Key Differentiator**: Hybrid profile combining technical ML/Data skills with business communication expertise.

## Architecture

The project uses a Docker-based stack:
- **n8n**: Workflow automation engine (port 5678)
- **PostgreSQL**: Database for portfolio data and audit logs (port 5432)
- **Ollama**: Local LLM inference server (port 11434)
- **MCP Sidecar**: HTTP API bridge for GitHub integration (port 8080)
- **Dashboard**: React-based portfolio dashboard (planned)

## Common Commands

### Environment Setup
```bash
# Start the full stack
docker compose up -d

# Stop the stack
docker compose down

# View logs
docker compose logs -f [service_name]

# Check service status
docker compose ps
```

### Database Operations
```bash
# Connect to PostgreSQL
docker exec -it postgresql psql -U admin_user_db -d n8n_database

# Backup database
docker exec postgresql pg_dump -U admin_user_db n8n_database > backup.sql
```

### Ollama Model Management
```bash
# Pull models (if ollama CLI is installed locally)
ollama pull llama3.2:1b
ollama pull mistral:instruct

# List available models
ollama list

# Via Docker container
docker exec ollama ollama pull mistral:instruct
```

### Windows Setup
```powershell
# Run the Windows setup script
.\setup-win.ps1
```

## Development Workflow

1. **Initial Setup**: Run `setup-win.ps1` to create `.env` and start services
2. **Access n8n**: Navigate to http://localhost:5678 (credentials in `.env`)
3. **Import Workflows**: Import workflow files from `n8n/` directory
4. **Configure Integrations**: Set up GitHub tokens, Slack webhooks in n8n
5. **Test MCP Sidecar**: Test endpoints at http://localhost:8080/mcp/tools

## Project Structure

```
├── docker-compose.yml          # Service definitions
├── setup-win.ps1              # Windows setup script
├── .env                        # Environment variables (auto-generated)
├── .env.example               # Environment template
├── sidecar-mcp/               # MCP sidecar service
│   ├── src/
│   │   ├── index.ts           # Express server
│   │   ├── github.ts          # GitHub API integration
│   │   └── mcpTools.ts        # Tool registry
│   ├── Dockerfile
│   └── package.json
├── sql/                       # Database schema and seeds
│   ├── schema.sql
│   └── seed.sql
├── n8n/                       # n8n workflow definitions
├── prompts/                   # AI prompts for portfolio generation
│   ├── system_agent.md
│   ├── summarize_project.md
│   └── validate_publish.md
├── dashboard/                 # React portfolio dashboard (planned)
└── volumes/                   # Persistent data storage
    ├── n8n_data/
    ├── postgres_data/
    └── ollama_data/
```

## Database Schema

The system uses two main tables:
- `portfolio_events`: Audit log for all portfolio operations
- `portfolio_items`: Portfolio entries with status tracking (draft/approved/published)

## Security Notes

- All sensitive credentials are in `.env` (not committed)
- PostgreSQL uses auto-generated random passwords
- n8n requires basic auth (credentials in `.env`)
- The system is designed for local/personal use

## MCP Integration

The MCP (Model Context Protocol) sidecar provides:
- GitHub repository listing and README fetching
- HTTP API endpoints for tool registration and execution
- Bridge between n8n workflows and external data sources

### Available MCP Tools
- `github.list_repos`: List all public repositories
- `github.read_readme`: Fetch README content from a specific repository

### Testing MCP Endpoints
```bash
# List available tools
curl http://localhost:8080/mcp/tools | jq

# Call a specific tool
curl -X POST http://localhost:8080/mcp/call \
  -H 'Content-Type: application/json' \
  -d '{"tool":"github.list_repos"}' | jq
```

## Troubleshooting

### Common Issues
- **Docker not found**: Install Docker Desktop from https://www.docker.com/get-started/
- **Port conflicts**: Ensure ports 5432, 5678, and 11434 are available
- **Permission errors**: On Windows, run setup script as administrator if needed
- **Ollama models not downloading**: Check internet connection and disk space

### Log Locations
- n8n logs: `docker compose logs n8n`
- PostgreSQL logs: `docker compose logs db`
- Ollama logs: `docker compose logs ollama`
- MCP Sidecar logs: `docker compose logs sidecar`

## Workflow Process

1. **Trigger**: Cron (weekly) or webhook (manual)
2. **Scan**: Fetch repos via MCP sidecar
3. **Filter**: Recent repos (7 days) or popular (>5 stars)
4. **Analyze**: Generate summaries with Ollama LLM
5. **Validate**: Human approval via Slack/Telegram
6. **Publish**: Push to Notion/portfolio site
7. **Audit**: Log all operations to PostgreSQL

## AI Configuration

The system uses Ollama for local LLM inference. Recommended models:
- `llama3.2:1b`: Fast, lightweight summaries
- `mistral:instruct`: Higher quality analysis

Portfolio items include:
- Title and short pitch (CV-ready)
- Long description (structured)
- Tags and tech stack
- Impact metrics (when available)
- AI confidence score (0-100)

## 🎯 Development Roadmap - 3 Phases

### ✅ What's Already Built (Backend Foundation)

**Infrastructure**:
- ✅ Docker compose stack (n8n, PostgreSQL, Ollama, MCP Sidecar)
- ✅ Database schema with portfolio_items, portfolio_events, portfolio_config
- ✅ n8n workflow automation for GitHub scanning
- ✅ Ollama integration for AI-powered project summarization
- ✅ MCP Sidecar for GitHub API integration
- ✅ Dashboard backend (FastAPI) with REST API
- ✅ Dashboard frontend structure (React + Vite + Tailwind)

**Backend API Features**:
- ✅ CRUD operations for portfolio items
- ✅ Statistics and analytics endpoints
- ✅ PDF export functionality
- ✅ Event logging and audit trail

### 🚀 Phase 1: MVP Portfolio (2 weeks) - PRIORITY

**Goal**: Professional landing page showcasing reconversion journey and top projects

**Frontend Components to Build**:
1. **Hero Section** (`components/Hero.jsx`)
   - Professional photo + title: "Data Scientist en Alternance"
   - Elevator pitch highlighting commercial → tech transition
   - CTAs: "Voir mes projets", "Mon parcours", "Me contacter"

2. **Career Timeline** (`components/Timeline.jsx`)
   - Interactive visual timeline (2017-2025)
   - 3 phases: Commercial → Formation Intensive → Alternance
   - Milestones with metrics (X projects, Y certifications, Z hours of code)

3. **Top Projects Showcase** (`components/ProjectShowcase.jsx`)
   - Display 3-5 best projects from database
   - Each project card shows:
     - Title + tagline
     - Tech stack badges
     - GitHub stats (stars, language)
     - Business impact (if applicable)
     - Links to demo/GitHub/article

4. **Skills Section** (`components/Skills.jsx`)
   - **Technical skills**: ML/DL, Data Engineering, Cloud, MLOps
   - **Business skills**: Communication, Vulgarisation, ROI analysis
   - Visual representation (radar chart or skill bars)

5. **Contact Section** (`components/Contact.jsx`)
   - Email, LinkedIn, GitHub links
   - Simple contact form (optional)
   - Download CV button (PDF export)

**Backend Enhancements**:
- Add `/api/profile` endpoint for personal info (name, title, bio, social links)
- Add `/api/timeline` endpoint for career milestones
- Enhance `/api/projects` with filtering (top 3, by status, by tag)

**Database Updates**:
```sql
-- Add profile table
CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(200),
  title VARCHAR(200),
  bio TEXT,
  hero_pitch TEXT,
  email VARCHAR(200),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  photo_url VARCHAR(500)
);

-- Add timeline table
CREATE TABLE timeline_events (
  id SERIAL PRIMARY KEY,
  date DATE,
  title VARCHAR(200),
  description TEXT,
  category VARCHAR(50), -- 'commercial', 'formation', 'alternance'
  metrics JSONB
);
```

**Tasks**:
- [ ] Create profile and timeline tables + seed data
- [ ] Build Hero component with profile data
- [ ] Build Timeline component with animations
- [ ] Build ProjectShowcase pulling from portfolio_items
- [ ] Build Skills section (static for now)
- [ ] Build Contact section
- [ ] Basic routing and navigation
- [ ] Deploy to test environment

**Success Metrics**:
- Portfolio accessible at localhost:3000
- All sections render correctly
- Data flows from PostgreSQL → FastAPI → React
- Mobile responsive
- Load time < 2s

### 🎨 Phase 2: Credibility & Trust (4 weeks)

**Goal**: Add social proof, certifications, blog, and testimonials

**New Features**:

1. **Alternance/Experience Section** (`components/Experience.jsx`)
   - Detailed view of current alternance
   - Company logo, role, period
   - Key missions and achievements
   - Technologies used
   - Business impact with metrics

2. **Certifications & Education** (`components/Certifications.jsx`)
   - Grid of certifications (AWS, TensorFlow, Kaggle, etc.)
   - Education details (school, degree, specialization)
   - Projects from formation

3. **Blog Integration** (`pages/Blog.jsx`)
   - List of articles (stored in database or markdown files)
   - Categories: Reconversion, Tutorials, Projects
   - Example articles:
     - "Comment j'ai appris le ML en 6 mois"
     - "Du commercial à la data science : 5 leçons"
     - "Expliquer la régression logistique simplement"
   - Basic SEO optimization

4. **Testimonials** (`components/Testimonials.jsx`)
   - Quotes from manager, professors, colleagues
   - Photos and titles
   - Stored in database or config file

5. **GitHub Stats Widget** (`components/GitHubStats.jsx`)
   - Integration with GitHub API
   - Contribution heatmap
   - Language breakdown
   - Streak counter
   - Top repositories

6. **Kaggle Integration** (optional)
   - Kaggle rank and medals
   - Link to profile

7. **Work in Progress Section** (`components/WorkInProgress.jsx`)
   - Transparency: show what you're currently learning
   - Progress bars (e.g., "AWS ML Certification - 60%")
   - Upcoming projects

**Backend Enhancements**:
- Add `/api/experiences` endpoint
- Add `/api/certifications` endpoint
- Add `/api/blog/posts` endpoint
- Add `/api/testimonials` endpoint
- GitHub API integration for stats
- Blog post management (CRUD)

**Database Updates**:
```sql
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(200),
  logo_url VARCHAR(500),
  role VARCHAR(200),
  start_date DATE,
  end_date DATE,
  description TEXT,
  missions TEXT[],
  technologies TEXT[],
  impact TEXT
);

CREATE TABLE certifications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  issuer VARCHAR(200),
  issue_date DATE,
  credential_url VARCHAR(500),
  logo_url VARCHAR(500)
);

CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300),
  slug VARCHAR(300) UNIQUE,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(100),
  tags TEXT[],
  published_date TIMESTAMP,
  updated_at TIMESTAMP,
  read_time_minutes INTEGER,
  views INTEGER DEFAULT 0
);

CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  author_name VARCHAR(200),
  author_role VARCHAR(200),
  author_photo_url VARCHAR(500),
  quote TEXT,
  created_at TIMESTAMP
);
```

**Tasks**:
- [ ] Build all new components
- [ ] Add blog system (markdown support)
- [ ] Write 2-3 initial blog posts
- [ ] Gather testimonials from contacts
- [ ] Integrate GitHub API
- [ ] Add SEO meta tags
- [ ] Create sitemap

**Success Metrics**:
- At least 3 blog posts published
- 2-3 testimonials displayed
- GitHub stats updating daily
- Blog posts indexable by search engines

### ⚡ Phase 3: Advanced Features & Differentiation (8 weeks)

**Goal**: Dual-mode portfolio, AI features, analytics, and full automation

**Major Features**:

1. **Dual Mode Toggle** (`components/ModeToggle.jsx`)
   - Switch between CDI and Freelance views
   - Different content/sections per mode:
     - **CDI Mode**: Projects, skills, open source, publications, culture fit
     - **Freelance Mode**: Case studies, services, pricing, testimonials, ROI calculator

2. **Services & Pricing Page** (Freelance mode) (`pages/Services.jsx`)
   - Service packages:
     - "Audit Data/IA" (2-5 days)
     - "POC/MVP" (2-4 weeks)
     - "Production Deployment" (1-3 months)
     - "Team Training" (1 week)
   - Pricing indication (TJM or "Sur devis")
   - Clear process: Discovery → Development → Deployment
   - Calendly integration for booking

3. **Case Studies Page** (Freelance mode) (`pages/CaseStudies.jsx`)
   - Business-focused project presentations
   - Each case study includes:
     - Client context (industry, size)
     - Business problem (non-technical)
     - Solution delivered
     - Measurable results (€, %, time saved)
     - Client testimonial

4. **Interactive Demos** (`pages/Demos.jsx`)
   - Embedded Streamlit/Gradio apps
   - "Try it yourself" section
   - Link to Jupyter notebooks (Colab)
   - API playground

5. **AI-Powered Features**:
   - **Resume Tailoring** (`features/ResumeTailor.jsx`):
     - User pastes job posting
     - LLM generates customized resume highlighting relevant projects
     - Downloadable PDF
   - **Skill Matcher** (`features/SkillMatcher.jsx`):
     - Compare your skills vs job requirements
     - Show match percentage
     - Suggest projects to highlight
   - **ROI Calculator** (Freelance) (`features/ROICalculator.jsx`):
     - Client inputs (data volume, current costs, etc.)
     - Calculate potential savings with AI solution
     - Lead generation tool

6. **Chatbot FAQ** (`components/Chatbot.jsx`)
   - Embedded chat widget
   - Answers common questions:
     - Experience level
     - Availability
     - Technologies
     - Pricing (freelance)
   - Powered by Ollama or OpenAI

7. **Analytics Dashboard** (Admin only) (`pages/Admin.jsx`)
   - Views per page
   - Most viewed projects
   - Traffic sources
   - Contact form submissions
   - CDI vs Freelance mode usage
   - Geographic distribution

8. **Advanced n8n Automation**:
   - Auto-update GitHub stats daily
   - Weekly digest of new projects
   - Auto-publish approved projects to Notion
   - Send weekly analytics report via email
   - Social media auto-posting (LinkedIn, Twitter)

**Backend Enhancements**:
- Add `/api/mode` endpoint to track current mode (CDI/Freelance)
- Add `/api/services` endpoint for service packages
- Add `/api/case-studies` endpoint
- Add `/api/ai/tailor-resume` endpoint (LLM integration)
- Add `/api/ai/match-skills` endpoint
- Add `/api/ai/calculate-roi` endpoint
- Add `/api/analytics` endpoints for admin dashboard
- Add `/api/chatbot` endpoint for FAQ
- Event tracking (page views, clicks, mode switches)

**Database Updates**:
```sql
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  duration VARCHAR(100),
  price_range VARCHAR(100),
  description TEXT,
  deliverables TEXT[]
);

CREATE TABLE case_studies (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES portfolio_items(id),
  client_industry VARCHAR(200),
  client_size VARCHAR(100),
  business_problem TEXT,
  solution TEXT,
  results TEXT,
  roi_percentage INTEGER,
  testimonial TEXT,
  visible_in_freelance_mode BOOLEAN DEFAULT TRUE
);

CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  event_type VARCHAR(100), -- 'page_view', 'project_click', 'mode_switch', 'contact_submit'
  event_data JSONB,
  user_agent TEXT,
  ip_address VARCHAR(50),
  referrer TEXT
);

CREATE TABLE chatbot_conversations (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100),
  question TEXT,
  answer TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Tasks**:
- [ ] Implement mode toggle with state management
- [ ] Build all Freelance-specific pages
- [ ] Build AI-powered features (resume tailor, skill matcher, ROI calc)
- [ ] Integrate Ollama for chatbot
- [ ] Build analytics dashboard
- [ ] Add event tracking throughout app
- [ ] Create case studies from existing projects
- [ ] Set up Calendly integration
- [ ] Automate social media posting
- [ ] SEO optimization and sitemap
- [ ] Performance optimization (lazy loading, caching)
- [ ] Add dark mode
- [ ] Mobile app (PWA)

**Success Metrics**:
- Mode toggle working smoothly
- AI features generating value (resume downloads, skill matches)
- Analytics tracking all key events
- At least 3 case studies published
- Chatbot answering 80%+ of FAQs correctly
- Page load time < 1.5s
- Lighthouse score > 90

## Implementation Strategy

### Tech Stack Decisions

**Frontend**:
- React 18 + Vite (already set up)
- Tailwind CSS for styling
- React Router for navigation
- Context API or Zustand for state management
- Framer Motion for animations
- Recharts or D3.js for data visualization
- React Markdown for blog posts

**Backend**:
- FastAPI (already set up)
- asyncpg for PostgreSQL
- Pydantic for validation
- ReportLab for PDF generation
- httpx for external API calls

**AI/ML**:
- Ollama for local LLM inference
- LangChain for prompt management (optional)
- OpenAI API as fallback (optional)

**Analytics**:
- Custom event tracking (PostgreSQL)
- Google Analytics 4 (optional)
- Plausible or Umami (privacy-friendly alternative)

### Deployment Strategy

**Development** (current):
- Docker Compose locally
- localhost:3000 (frontend), localhost:8000 (backend)

**Staging** (Phase 2):
- Deploy to VPS or cloud (DigitalOcean, Hetzner, AWS)
- Subdomain: staging.votre-domaine.dev

**Production** (Phase 3):
- Custom domain: votre-prenom-nom.dev or .com
- CDN for static assets (Cloudflare)
- SSL certificate (Let's Encrypt)
- Automated backups (PostgreSQL)
- Monitoring (Sentry, Uptime Robot)

### Priority Matrix

**Must Have (Phase 1)**:
- Hero + Timeline + Projects + Skills + Contact
- Data flow: DB → API → Frontend
- Mobile responsive
- Basic SEO

**Should Have (Phase 2)**:
- Blog with 3+ posts
- Testimonials
- GitHub stats
- Certifications
- Experience section

**Nice to Have (Phase 3)**:
- Dual mode toggle
- AI features
- Analytics dashboard
- Chatbot
- Advanced automation

### Weekly Breakdown (Phase 1)

**Week 1**:
- Day 1-2: Database schema updates (profile, timeline)
- Day 3-4: Backend API endpoints
- Day 5-7: Hero + Timeline components

**Week 2**:
- Day 1-3: ProjectShowcase + Skills components
- Day 4-5: Contact section + routing
- Day 6-7: Testing, bug fixes, responsive design

## Current Status

- ✅ **Phase 1 COMPLETE**: Hero, Timeline, Profile API, Full data flow
- ✅ **Phase 2 COMPLETE**: Projects, Blog, Testimonials, Skills, Contact Form
- ✅ **Phase 3 COMPLETE**: Dual Mode (CDI/Freelance), Analytics, Content Overrides
- ✅ **n8n Automation**: 4 workflows created (GitHub sync, notifications, analytics, content review)

## n8n Workflows Created

Located in `n8n/workflows/`:

1. **`1_github_portfolio_sync.json`**: Auto-sync GitHub repos every 6h with Ollama summaries
2. **`2_visitor_notifications.json`**: Real-time visitor alerts every 15min
3. **`3_analytics_daily_digest.json`**: Daily analytics report at 9AM
4. **`4_content_review_alerts.json`**: Content pending review alerts every 12h

**Setup Guide**: See `N8N_SETUP_GUIDE.md` for complete configuration instructions.

## Quick Start

```bash
# 1. Start all services
docker compose up -d

# 2. Apply all migrations
cat sql/phase1_schema.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase1_seed.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase2_schema.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase2_seed.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase3_schema.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database
cat sql/phase3_seed.sql | docker exec -i postgresql psql -U admin_user_db -d n8n_database

# 3. Start frontend
cd dashboard/frontend
npm install
npm run dev

# 4. Access services
# Portfolio: http://localhost:3005
# Backend API: http://localhost:8000/docs
# n8n: http://localhost:5678
```

## Next Steps

1. **Personalize Data**: Edit `sql/phase*_seed.sql` files with your real information
2. **Configure n8n**: Follow `N8N_SETUP_GUIDE.md` to set up automation workflows
3. **Import Workflows**: Import JSON workflows from `n8n/workflows/` into n8n interface
4. **Deploy**: Deploy to production (Vercel + Railway/Render recommended)