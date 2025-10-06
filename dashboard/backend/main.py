from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse, RedirectResponse
from typing import List, Optional
import os
import asyncpg
from datetime import datetime, date
import json
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
import io
import base64
import urllib.parse

app = FastAPI(
    title="Portfolio Dashboard",
    description="Dashboard professionnel pour portfolio automatisé",
    version="1.0.0"
)

# CORS pour permettre au frontend React d'accéder à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration base de données
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "5432")),
    "user": os.getenv("DB_USER", "admin_user_db"),
    "password": os.getenv("DB_PASSWORD", "O2ZkUw6Qjh5HCJT97mNWFgtzDaPv1LeA"),
    "database": os.getenv("DB_NAME", "n8n_database")
}

# Models Pydantic
from pydantic import BaseModel
from typing import List, Optional

class BusinessMetrics(BaseModel):
    revenue_impact: Optional[str] = None
    users_impacted: Optional[str] = None
    performance_gain: Optional[str] = None
    roi_percentage: Optional[int] = None
    market_potential: Optional[str] = None

class TechnicalMetrics(BaseModel):
    uptime: Optional[str] = None
    response_time: Optional[str] = None
    code_coverage: Optional[str] = None
    security_score: Optional[str] = None
    performance_score: Optional[int] = None
    accuracy: Optional[str] = None

class PortfolioItem(BaseModel):
    id: int
    repo: str
    title: str
    short_pitch: str
    long_desc: str
    tags: List[str]
    stack: List[str]
    impact: str
    github_url: str
    github_stars: int
    github_forks: int
    github_language: Optional[str]
    last_commit_date: Optional[datetime]
    ai_confidence_score: float
    status: str
    created_at: datetime
    updated_at: datetime
    human_reviewed: bool
    business_metrics: Optional[dict] = {}
    technical_metrics: Optional[dict] = {}
    achievements: Optional[List[str]] = []
    complexity_score: Optional[int] = 3
    team_size: Optional[int] = 1
    project_duration_months: Optional[int] = 1
    demo_url: Optional[str] = None
    live_url: Optional[str] = None

class PortfolioStats(BaseModel):
    total_projects: int
    approved_projects: int
    draft_projects: int
    avg_confidence: float
    top_languages: List[dict]
    total_stars: int

class PortfolioEvent(BaseModel):
    id: int
    ts: datetime
    source: str
    repo: Optional[str]
    action: str
    payload: Optional[dict]
    status: str

# Connexion DB
async def get_db_connection():
    return await asyncpg.connect(**DB_CONFIG)

# Routes API

@app.get("/")
async def root():
    return {"message": "Portfolio Dashboard API", "version": "1.0.0"}

@app.get("/api/portfolio", response_model=List[PortfolioItem])
async def get_portfolio_items(
    status: Optional[str] = Query(None, description="Filter by status"),
    language: Optional[str] = Query(None, description="Filter by language"),
    min_confidence: Optional[float] = Query(None, description="Minimum confidence score"),
    limit: int = Query(50, description="Limit results")
):
    """Récupérer les items du portfolio avec filtres optionnels"""
    conn = await get_db_connection()
    try:
        query = """
            SELECT id, repo, title, short_pitch, long_desc, tags, stack, impact,
                   github_url, github_stars, github_forks, github_language,
                   last_commit_date, ai_confidence_score, status, created_at,
                   updated_at, human_reviewed, business_metrics, technical_metrics,
                   achievements, complexity_score, team_size, project_duration_months,
                   demo_url, live_url
            FROM portfolio_items
            WHERE 1=1
        """
        params = []
        param_count = 0

        if status:
            param_count += 1
            query += f" AND status = ${param_count}"
            params.append(status)

        if language:
            param_count += 1
            query += f" AND github_language = ${param_count}"
            params.append(language)

        if min_confidence:
            param_count += 1
            query += f" AND ai_confidence_score >= ${param_count}"
            params.append(min_confidence)

        query += " ORDER BY created_at DESC"

        if limit:
            param_count += 1
            query += f" LIMIT ${param_count}"
            params.append(limit)

        rows = await conn.fetch(query, *params)

        items = []
        for row in rows:
            item = dict(row)
            # Convertir les arrays PostgreSQL en listes Python
            item['tags'] = list(item['tags']) if item['tags'] else []
            item['stack'] = list(item['stack']) if item['stack'] else []
            item['achievements'] = item['achievements'] if item['achievements'] else []
            # S'assurer que les métriques sont des dictionnaires
            item['business_metrics'] = item['business_metrics'] if item['business_metrics'] else {}
            item['technical_metrics'] = item['technical_metrics'] if item['technical_metrics'] else {}
            items.append(PortfolioItem(**item))

        return items

    finally:
        await conn.close()

@app.get("/api/portfolio/{item_id}", response_model=PortfolioItem)
async def get_portfolio_item(item_id: int):
    """Récupérer un item spécifique du portfolio"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """SELECT * FROM portfolio_items WHERE id = $1""",
            item_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        item = dict(row)
        item['tags'] = list(item['tags']) if item['tags'] else []
        item['stack'] = list(item['stack']) if item['stack'] else []
        item['achievements'] = item['achievements'] if item['achievements'] else []
        item['business_metrics'] = item['business_metrics'] if item['business_metrics'] else {}
        item['technical_metrics'] = item['technical_metrics'] if item['technical_metrics'] else {}
        return PortfolioItem(**item)

    finally:
        await conn.close()

@app.get("/api/stats", response_model=PortfolioStats)
async def get_portfolio_stats():
    """Statistiques du portfolio"""
    conn = await get_db_connection()
    try:
        # Stats générales
        stats_row = await conn.fetchrow("""
            SELECT
                COUNT(*) as total_projects,
                COUNT(*) FILTER (WHERE status = 'approved') as approved_projects,
                COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
                COALESCE(AVG(ai_confidence_score), 0) as avg_confidence,
                COALESCE(SUM(github_stars), 0) as total_stars
            FROM portfolio_items
        """)

        # Top langages
        languages = await conn.fetch("""
            SELECT github_language as language, COUNT(*) as count
            FROM portfolio_items
            WHERE github_language IS NOT NULL
            GROUP BY github_language
            ORDER BY count DESC
            LIMIT 10
        """)

        return PortfolioStats(
            total_projects=stats_row['total_projects'],
            approved_projects=stats_row['approved_projects'],
            draft_projects=stats_row['draft_projects'],
            avg_confidence=round(float(stats_row['avg_confidence']), 2),
            total_stars=stats_row['total_stars'],
            top_languages=[{"language": row['language'], "count": row['count']} for row in languages]
        )

    finally:
        await conn.close()

@app.get("/api/events", response_model=List[PortfolioEvent])
async def get_portfolio_events(limit: int = Query(20, description="Limit results")):
    """Récupérer les événements du portfolio"""
    conn = await get_db_connection()
    try:
        rows = await conn.fetch(
            """
            SELECT id, ts, source, repo, action, payload, status
            FROM portfolio_events
            ORDER BY ts DESC
            LIMIT $1
            """,
            limit
        )

        events = []
        for row in rows:
            event = dict(row)
            # Parser le JSON payload s'il existe
            if event['payload']:
                try:
                    event['payload'] = json.loads(event['payload']) if isinstance(event['payload'], str) else event['payload']
                except:
                    event['payload'] = {}
            events.append(PortfolioEvent(**event))

        return events

    finally:
        await conn.close()

@app.put("/api/portfolio/{item_id}/status")
async def update_portfolio_status(item_id: int, status: str):
    """Mettre à jour le statut d'un item portfolio"""
    if status not in ['draft', 'approved', 'published', 'archived']:
        raise HTTPException(status_code=400, detail="Invalid status")

    conn = await get_db_connection()
    try:
        result = await conn.execute(
            """
            UPDATE portfolio_items
            SET status = $1, human_reviewed = true, updated_at = NOW()
            WHERE id = $2
            """,
            status, item_id
        )

        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        # Log l'événement
        await conn.execute(
            """
            INSERT INTO portfolio_events (source, repo, action, payload, status)
            SELECT 'manual', repo, 'status_updated', $1::jsonb, 'ok'
            FROM portfolio_items WHERE id = $2
            """,
            json.dumps({"new_status": status, "item_id": item_id}),
            item_id
        )

        return {"message": "Status updated successfully"}

    finally:
        await conn.close()

@app.get("/api/export/pdf/{item_id}")
async def export_portfolio_pdf(item_id: int, template: str = Query("professional", description="PDF template style")):
    """Exporter un item portfolio en PDF"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """SELECT * FROM portfolio_items WHERE id = $1""",
            item_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        # Créer le PDF avec template sélectionné
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        story = []

        # Templates de styles
        templates = {
            "professional": {
                "title_color": colors.darkblue,
                "accent_color": colors.blue,
                "title_size": 24,
                "header_bg": colors.lightblue
            },
            "modern": {
                "title_color": colors.purple,
                "accent_color": colors.purple,
                "title_size": 26,
                "header_bg": colors.lavender
            },
            "minimalist": {
                "title_color": colors.black,
                "accent_color": colors.gray,
                "title_size": 22,
                "header_bg": colors.lightgrey
            }
        }

        current_template = templates.get(template, templates["professional"])

        # En-tête avec logo et informations du développeur
        header_data = [
            ["Raouf Addeche", "Développeur Full Stack"],
            ["Portfolio Project", datetime.now().strftime("%B %Y")]
        ]
        header_table = Table(header_data, colWidths=[3*inch, 3*inch])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), current_template["header_bg"]),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(header_table)
        story.append(Spacer(1, 20))

        # Titre
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=current_template["title_size"],
            spaceAfter=30,
            textColor=current_template["title_color"],
            alignment=1  # Center alignment
        )
        story.append(Paragraph(row['title'], title_style))
        story.append(Spacer(1, 12))

        # Séparateur visuel
        from reportlab.platypus import HRFlowable
        story.append(HRFlowable(width="100%", thickness=2, color=current_template["accent_color"]))
        story.append(Spacer(1, 12))

        # Pitch court
        story.append(Paragraph("<b>Résumé :</b>", styles['Heading2']))
        story.append(Paragraph(row['short_pitch'], styles['Normal']))
        story.append(Spacer(1, 12))

        # Description longue
        story.append(Paragraph("<b>Description détaillée :</b>", styles['Heading2']))
        story.append(Paragraph(row['long_desc'], styles['Normal']))
        story.append(Spacer(1, 12))

        # Métriques business
        if row['business_metrics']:
            story.append(Paragraph("<b>Métriques Business :</b>", styles['Heading2']))
            for key, value in row['business_metrics'].items():
                if value:
                    story.append(Paragraph(f"• <b>{key.replace('_', ' ').title()}:</b> {value}", styles['Normal']))
            story.append(Spacer(1, 12))

        # Métriques techniques
        if row['technical_metrics']:
            story.append(Paragraph("<b>Métriques Techniques :</b>", styles['Heading2']))
            for key, value in row['technical_metrics'].items():
                if value:
                    story.append(Paragraph(f"• <b>{key.replace('_', ' ').title()}:</b> {value}", styles['Normal']))
            story.append(Spacer(1, 12))

        # Métriques business (en tableaux visuels)
        if row['business_metrics']:
            story.append(Paragraph("<b>Impact Business :</b>", styles['Heading2']))
            business_data = []
            for key, value in row['business_metrics'].items():
                if value:
                    formatted_key = key.replace('_', ' ').title()
                    business_data.append([formatted_key, str(value)])

            if business_data:
                business_table = Table(business_data, colWidths=[2.5*inch, 3.5*inch])
                business_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.blue),
                    ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('BACKGROUND', (1, 0), (1, -1), colors.lightblue),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(business_table)
                story.append(Spacer(1, 12))

        # Métriques techniques
        if row['technical_metrics']:
            story.append(Paragraph("<b>Performance Technique :</b>", styles['Heading2']))
            tech_metrics_data = []
            for key, value in row['technical_metrics'].items():
                if value:
                    formatted_key = key.replace('_', ' ').title()
                    tech_metrics_data.append([formatted_key, str(value)])

            if tech_metrics_data:
                tech_metrics_table = Table(tech_metrics_data, colWidths=[2.5*inch, 3.5*inch])
                tech_metrics_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.green),
                    ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('BACKGROUND', (1, 0), (1, -1), colors.lightgreen),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(tech_metrics_table)
                story.append(Spacer(1, 12))

        # Réalisations
        if row['achievements']:
            story.append(Paragraph("<b>Réalisations :</b>", styles['Heading2']))
            for achievement in row['achievements']:
                story.append(Paragraph(f"• {achievement}", styles['Normal']))
            story.append(Spacer(1, 12))

        # Informations techniques
        tech_data = [
            ['GitHub URL', row['github_url']],
            ['Langage principal', row['github_language'] or 'N/A'],
            ['Stars', str(row['github_stars'])],
            ['Forks', str(row['github_forks'])],
            ['Technologies', ', '.join(row['stack']) if row['stack'] else 'N/A'],
            ['Tags', ', '.join(row['tags']) if row['tags'] else 'N/A'],
            ['Complexité', f"{row['complexity_score']}/10" if row['complexity_score'] else 'N/A'],
            ['Équipe', f"{row['team_size']} personne(s)" if row['team_size'] else 'N/A'],
            ['Durée', f"{row['project_duration_months']} mois" if row['project_duration_months'] else 'N/A']
        ]

        tech_table = Table(tech_data, colWidths=[2*inch, 4*inch])
        tech_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (1, 0), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))

        story.append(Paragraph("<b>Informations techniques :</b>", styles['Heading2']))
        story.append(tech_table)

        doc.build(story)
        buffer.seek(0)

        # Pied de page avec QR code conceptuel (texte pour l'instant)
        footer_data = [
            ["Généré automatiquement", f"Portfolio Dashboard - {datetime.now().strftime('%d/%m/%Y')}"],
            ["GitHub", row['github_url']],
            ["Contact", "raouf.addeche@example.com"]
        ]
        footer_table = Table(footer_data, colWidths=[2*inch, 4*inch])
        footer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(Spacer(1, 20))
        story.append(footer_table)

        doc.build(story)
        buffer.seek(0)

        # Retourner le PDF
        return FileResponse(
            io.BytesIO(buffer.getvalue()),
            media_type='application/pdf',
            filename=f"portfolio_{template}_{row['repo'].replace('/', '_')}.pdf"
        )

    finally:
        await conn.close()

@app.get("/api/export/portfolio-summary")
async def export_portfolio_summary_pdf(template: str = Query("professional", description="PDF template style")):
    """Exporter un résumé complet du portfolio en PDF"""
    conn = await get_db_connection()
    try:
        # Récupérer tous les projets approuvés/publiés
        rows = await conn.fetch(
            """
            SELECT * FROM portfolio_items
            WHERE status IN ('approved', 'published')
            ORDER BY ai_confidence_score DESC, github_stars DESC
            LIMIT 5
            """
        )

        if not rows:
            raise HTTPException(status_code=404, detail="No approved projects found")

        # Créer le PDF de résumé
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=72)
        styles = getSampleStyleSheet()
        story = []

        # En-tête du portfolio
        story.append(Paragraph("Portfolio Professionnel", ParagraphStyle(
            'PortfolioTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.darkblue,
            alignment=1,
            spaceAfter=20
        )))

        story.append(Paragraph("Raouf Addeche - Développeur Full Stack", ParagraphStyle(
            'Subtitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.blue,
            alignment=1,
            spaceAfter=30
        )))

        # Résumé exécutif
        story.append(Paragraph("<b>Résumé Exécutif</b>", styles['Heading2']))
        story.append(Paragraph(
            "Développeur passionné spécialisé en intelligence artificielle, automatisation et développement full-stack. "
            "Expertise en Python, React, et architectures cloud modernes. Créateur de solutions innovantes combinant "
            "IA, DevOps et interfaces utilisateur intuitives.",
            styles['Normal']
        ))
        story.append(Spacer(1, 20))

        # Projets phares
        story.append(Paragraph("<b>Projets Phares</b>", styles['Heading2']))

        for i, row in enumerate(rows):
            # Titre du projet
            project_title = ParagraphStyle(
                f'ProjectTitle{i}',
                parent=styles['Heading3'],
                fontSize=14,
                textColor=colors.darkblue,
                spaceAfter=10
            )
            story.append(Paragraph(f"{i+1}. {row['title']}", project_title))

            # Description courte
            story.append(Paragraph(row['short_pitch'], styles['Normal']))

            # Métriques en tableau compact
            if row['business_metrics'] or row['technical_metrics']:
                metrics_data = []
                if row['business_metrics']:
                    for key, value in row['business_metrics'].items():
                        if value:
                            metrics_data.append([key.replace('_', ' ').title(), str(value)])

                if metrics_data:
                    metrics_table = Table(metrics_data[:3], colWidths=[2*inch, 2*inch])  # Limite à 3 métriques
                    metrics_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),
                        ('FONTSIZE', (0, 0), (-1, -1), 8),
                        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
                    ]))
                    story.append(metrics_table)

            story.append(Spacer(1, 15))

        # Technologies maîtrisées
        all_techs = set()
        for row in rows:
            if row['stack']:
                all_techs.update(row['stack'])

        story.append(Paragraph("<b>Technologies Maîtrisées</b>", styles['Heading2']))
        tech_text = " • ".join(sorted(list(all_techs))[:15])  # Top 15 technologies
        story.append(Paragraph(tech_text, styles['Normal']))

        doc.build(story)
        buffer.seek(0)

        return FileResponse(
            io.BytesIO(buffer.getvalue()),
            media_type='application/pdf',
            filename=f"portfolio_summary_{template}_{datetime.now().strftime('%Y%m%d')}.pdf"
        )

    finally:
        await conn.close()

@app.get("/api/export/json")
async def export_portfolio_json():
    """Exporter tout le portfolio en JSON"""
    conn = await get_db_connection()
    try:
        rows = await conn.fetch(
            """
            SELECT repo, title, short_pitch, long_desc, tags, stack, impact,
                   github_url, github_stars, github_forks, github_language,
                   ai_confidence_score, status, created_at, business_metrics,
                   technical_metrics, achievements, complexity_score, team_size,
                   project_duration_months, demo_url, live_url
            FROM portfolio_items
            WHERE status IN ('approved', 'published')
            ORDER BY github_stars DESC, created_at DESC
            """
        )

        portfolio = []
        for row in rows:
            item = dict(row)
            item['tags'] = list(item['tags']) if item['tags'] else []
            item['stack'] = list(item['stack']) if item['stack'] else []
            item['achievements'] = item['achievements'] if item['achievements'] else []
            item['business_metrics'] = item['business_metrics'] if item['business_metrics'] else {}
            item['technical_metrics'] = item['technical_metrics'] if item['technical_metrics'] else {}
            item['created_at'] = item['created_at'].isoformat()
            portfolio.append(item)

        return {
            "portfolio": portfolio,
            "generated_at": datetime.now().isoformat(),
            "total_projects": len(portfolio)
        }

    finally:
        await conn.close()

@app.get("/api/share/linkedin/{item_id}")
async def share_on_linkedin(item_id: int):
    """Générer un lien de partage LinkedIn pour un projet"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """SELECT * FROM portfolio_items WHERE id = $1""",
            item_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        # Construire le message LinkedIn
        title = row['title']
        description = row['short_pitch']
        url = row['github_url']

        # Créer un message professionnel pour LinkedIn
        linkedin_text = f"""🚀 Nouveau projet: {title}

{description}

💡 Technologies: {', '.join(row['stack']) if row['stack'] else 'N/A'}

#Developer #TechInnovation #Portfolio #GitHub

Voir le code source: {url}"""

        # Encoder le texte pour l'URL LinkedIn
        encoded_text = urllib.parse.quote(linkedin_text)
        linkedin_share_url = f"https://www.linkedin.com/sharing/share-offsite/?url={urllib.parse.quote(url)}&title={urllib.parse.quote(title)}&summary={encoded_text}"

        # Logger l'événement de partage
        await conn.execute(
            """
            INSERT INTO portfolio_events (source, repo, action, payload, status)
            VALUES ($1, $2, $3, $4, $5)
            """,
            "social_share",
            row['repo'],
            "linkedin_share",
            json.dumps({
                "item_id": item_id,
                "platform": "linkedin",
                "shared_at": datetime.now().isoformat()
            }),
            "ok"
        )

        return RedirectResponse(url=linkedin_share_url)

    finally:
        await conn.close()

@app.get("/api/share/stackoverflow/{item_id}")
async def share_on_stackoverflow(item_id: int):
    """Générer un lien pour poser une question StackOverflow liée au projet"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """SELECT * FROM portfolio_items WHERE id = $1""",
            item_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        # Construire le template de question StackOverflow
        title = f"Best practices for {row['github_language']} project: {row['title']}"

        body = f"""I'm working on a {row['github_language']} project called "{row['title']}".

**Project Description:**
{row['short_pitch']}

**Technologies used:**
{', '.join(row['stack']) if row['stack'] else 'N/A'}

**GitHub Repository:** {row['github_url']}

I'm looking for feedback on best practices and potential improvements for this type of project. What would you recommend?"""

        # Construire l'URL StackOverflow
        encoded_title = urllib.parse.quote(title)
        encoded_body = urllib.parse.quote(body)
        tags = ",".join([row['github_language'].lower() if row['github_language'] else 'programming'] +
                       [tag.lower().replace(' ', '-') for tag in (row['tags'][:3] if row['tags'] else [])])
        encoded_tags = urllib.parse.quote(tags)

        stackoverflow_url = f"https://stackoverflow.com/questions/ask?title={encoded_title}&body={encoded_body}&tags={encoded_tags}"

        # Logger l'événement
        await conn.execute(
            """
            INSERT INTO portfolio_events (source, repo, action, payload, status)
            VALUES ($1, $2, $3, $4, $5)
            """,
            "social_share",
            row['repo'],
            "stackoverflow_share",
            json.dumps({
                "item_id": item_id,
                "platform": "stackoverflow",
                "shared_at": datetime.now().isoformat()
            }),
            "ok"
        )

        return RedirectResponse(url=stackoverflow_url)

    finally:
        await conn.close()

@app.get("/api/share/twitter/{item_id}")
async def share_on_twitter(item_id: int):
    """Générer un lien de partage Twitter pour un projet"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """SELECT * FROM portfolio_items WHERE id = $1""",
            item_id
        )
        if not row:
            raise HTTPException(status_code=404, detail="Portfolio item not found")

        # Créer un tweet optimisé
        title = row['title']
        url = row['github_url']
        main_tech = row['github_language'] or 'Tech'

        tweet_text = f"🚀 Just built: {title}\n\n💻 {main_tech}"

        # Ajouter quelques tags populaires
        if row['stack']:
            top_techs = row['stack'][:2]  # Prendre les 2 premières technologies
            hashtags = ' '.join([f"#{tech.replace(' ', '').replace('.', '').replace('-', '')}" for tech in top_techs])
            tweet_text += f" {hashtags}"

        tweet_text += f"\n\n#Developer #GitHub #OpenSource\n\n{url}"

        # Encoder pour Twitter
        encoded_tweet = urllib.parse.quote(tweet_text)
        twitter_url = f"https://twitter.com/intent/tweet?text={encoded_tweet}"

        # Logger l'événement
        await conn.execute(
            """
            INSERT INTO portfolio_events (source, repo, action, payload, status)
            VALUES ($1, $2, $3, $4, $5)
            """,
            "social_share",
            row['repo'],
            "twitter_share",
            json.dumps({
                "item_id": item_id,
                "platform": "twitter",
                "shared_at": datetime.now().isoformat()
            }),
            "ok"
        )

        return RedirectResponse(url=twitter_url)

    finally:
        await conn.close()

@app.get("/api/social-analytics")
async def get_social_analytics():
    """Statistiques de partage social"""
    conn = await get_db_connection()
    try:
        # Récupérer les stats de partage
        stats = await conn.fetch(
            """
            SELECT
                payload->>'platform' as platform,
                COUNT(*) as shares,
                MAX(ts) as last_share
            FROM portfolio_events
            WHERE action LIKE '%_share'
            GROUP BY payload->>'platform'
            ORDER BY shares DESC
            """
        )

        # Stats par projet
        project_stats = await conn.fetch(
            """
            SELECT
                repo,
                COUNT(*) as total_shares,
                COUNT(*) FILTER (WHERE payload->>'platform' = 'linkedin') as linkedin_shares,
                COUNT(*) FILTER (WHERE payload->>'platform' = 'twitter') as twitter_shares,
                COUNT(*) FILTER (WHERE payload->>'platform' = 'stackoverflow') as stackoverflow_shares
            FROM portfolio_events
            WHERE action LIKE '%_share'
            GROUP BY repo
            ORDER BY total_shares DESC
            """
        )

        return {
            "platform_stats": [dict(row) for row in stats],
            "project_stats": [dict(row) for row in project_stats],
            "total_shares": sum(row['shares'] for row in stats)
        }

    finally:
        await conn.close()

# ==================== PHASE 1: MVP ENDPOINTS ====================

# Models for Phase 1
class Profile(BaseModel):
    id: int
    full_name: str
    title: str
    bio: Optional[str]
    hero_pitch: str
    email: Optional[str]
    phone: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    kaggle_url: Optional[str]
    photo_url: Optional[str]
    location: Optional[str]
    availability: Optional[str]
    created_at: datetime
    updated_at: datetime

class TimelineEvent(BaseModel):
    id: int
    date: date
    end_date: Optional[date]
    title: str
    description: Optional[str]
    category: str
    icon: Optional[str]
    metrics: Optional[dict]
    tags: List[str]
    link_url: Optional[str]
    display_order: int
    is_highlight: bool
    created_at: datetime

class Skill(BaseModel):
    id: int
    name: str
    category: str
    subcategory: Optional[str]
    proficiency_level: Optional[int]
    years_experience: Optional[float]
    description: Optional[str]
    is_primary: bool
    icon: Optional[str]
    created_at: datetime

class SocialLink(BaseModel):
    id: int
    platform: str
    url: str
    display_name: Optional[str]
    icon: Optional[str]
    display_order: int
    is_active: bool
    created_at: datetime

# Profile endpoints
@app.get("/api/profile", response_model=Profile)
async def get_profile():
    """Récupérer les informations de profil"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow("SELECT * FROM profile LIMIT 1")
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        return Profile(**dict(row))
    finally:
        await conn.close()

@app.put("/api/profile")
async def update_profile(profile_data: dict):
    """Mettre à jour le profil"""
    conn = await get_db_connection()
    try:
        # Build update query dynamically based on provided fields
        fields = []
        values = []
        param_count = 0

        for key, value in profile_data.items():
            if key not in ['id', 'created_at', 'updated_at']:
                param_count += 1
                fields.append(f"{key} = ${param_count}")
                values.append(value)

        if not fields:
            raise HTTPException(status_code=400, detail="No valid fields to update")

        query = f"UPDATE profile SET {', '.join(fields)} WHERE id = 1 RETURNING *"
        row = await conn.fetchrow(query, *values)

        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")

        return Profile(**dict(row))
    finally:
        await conn.close()

# Timeline endpoints
@app.get("/api/timeline", response_model=List[TimelineEvent])
async def get_timeline(
    category: Optional[str] = Query(None, description="Filter by category"),
    highlights_only: bool = Query(False, description="Show only highlights")
):
    """Récupérer les événements de la timeline"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM timeline_events WHERE 1=1"
        params = []
        param_count = 0

        if category:
            param_count += 1
            query += f" AND category = ${param_count}"
            params.append(category)

        if highlights_only:
            query += " AND is_highlight = TRUE"

        query += " ORDER BY date ASC, display_order ASC"

        rows = await conn.fetch(query, *params)

        events = []
        for row in rows:
            event = dict(row)
            event['tags'] = list(event['tags']) if event['tags'] else []
            # Parse JSONB metrics if it's a string
            if isinstance(event.get('metrics'), str):
                event['metrics'] = json.loads(event['metrics']) if event['metrics'] else {}
            events.append(TimelineEvent(**event))

        return events
    finally:
        await conn.close()

@app.post("/api/timeline")
async def create_timeline_event(event: dict):
    """Créer un nouvel événement dans la timeline"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            """
            INSERT INTO timeline_events (date, end_date, title, description, category, icon, metrics, tags, link_url, display_order, is_highlight)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            """,
            event.get('date'),
            event.get('end_date'),
            event.get('title'),
            event.get('description'),
            event.get('category'),
            event.get('icon'),
            json.dumps(event.get('metrics')) if event.get('metrics') else None,
            event.get('tags', []),
            event.get('link_url'),
            event.get('display_order', 0),
            event.get('is_highlight', False)
        )

        result = dict(row)
        result['tags'] = list(result['tags']) if result['tags'] else []
        return TimelineEvent(**result)
    finally:
        await conn.close()

# Skills endpoints
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(
    category: Optional[str] = Query(None, description="Filter by category (technical, business, soft, tools)"),
    primary_only: bool = Query(False, description="Show only primary skills")
):
    """Récupérer les compétences"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM skills WHERE 1=1"
        params = []
        param_count = 0

        if category:
            param_count += 1
            query += f" AND category = ${param_count}"
            params.append(category)

        if primary_only:
            query += " AND is_primary = TRUE"

        query += " ORDER BY category, proficiency_level DESC, name ASC"

        rows = await conn.fetch(query, *params)
        return [Skill(**dict(row)) for row in rows]
    finally:
        await conn.close()

@app.get("/api/skills/grouped")
async def get_skills_grouped():
    """Récupérer les compétences groupées par catégorie"""
    conn = await get_db_connection()
    try:
        rows = await conn.fetch(
            """
            SELECT category, subcategory, json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'proficiency_level', proficiency_level,
                    'years_experience', years_experience,
                    'is_primary', is_primary,
                    'icon', icon
                ) ORDER BY proficiency_level DESC, name
            ) as skills
            FROM skills
            GROUP BY category, subcategory
            ORDER BY category
            """
        )

        result = {}
        for row in rows:
            category = row['category']
            subcategory = row['subcategory']

            if category not in result:
                result[category] = {}

            if subcategory:
                result[category][subcategory] = row['skills']
            else:
                if 'other' not in result[category]:
                    result[category]['other'] = []
                result[category]['other'].extend(row['skills'])

        return result
    finally:
        await conn.close()

# Social links endpoints
@app.get("/api/social-links", response_model=List[SocialLink])
async def get_social_links(active_only: bool = Query(True, description="Show only active links")):
    """Récupérer les liens sociaux"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM social_links"
        if active_only:
            query += " WHERE is_active = TRUE"
        query += " ORDER BY display_order ASC"

        rows = await conn.fetch(query)
        return [SocialLink(**dict(row)) for row in rows]
    finally:
        await conn.close()

# ==================== PHASE 2: CREDIBILITY & SHOWCASE ENDPOINTS ====================

# Models for Phase 2
class Project(BaseModel):
    id: int
    title: str
    slug: str
    short_description: str
    long_description: Optional[str]
    github_url: Optional[str]
    github_repo_name: Optional[str]
    github_stars: Optional[int]
    github_forks: Optional[int]
    github_language: Optional[str]
    demo_url: Optional[str]
    image_url: Optional[str]
    category: str
    tags: List[str]
    technologies: List[str]
    metrics: Optional[dict]
    business_impact: Optional[str]
    is_featured: bool
    is_published: bool
    display_order: int
    project_date: Optional[date]
    duration_months: Optional[int]
    team_size: Optional[int]
    role: Optional[str]
    created_at: datetime
    updated_at: datetime

class BlogPost(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: List[str]
    cover_image_url: Optional[str]
    category: str
    tags: List[str]
    read_time_minutes: Optional[int]
    view_count: int
    like_count: int
    is_published: bool
    is_featured: bool
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class Testimonial(BaseModel):
    id: int
    author_name: str
    author_title: str
    author_company: Optional[str]
    author_photo_url: Optional[str]
    author_linkedin_url: Optional[str]
    quote: str
    rating: Optional[int]
    relationship: Optional[str]
    project_context: Optional[str]
    date_given: Optional[date]
    is_featured: bool
    is_published: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

class GitHubStats(BaseModel):
    id: int
    username: str
    total_repos: int
    total_stars: int
    total_forks: int
    followers: int
    following: int
    total_contributions_year: int
    current_streak_days: int
    longest_streak_days: int
    languages: dict
    top_repos: List[dict]
    last_fetched_at: datetime
    created_at: datetime
    updated_at: datetime

class ContactSubmission(BaseModel):
    name: str
    email: str
    company: Optional[str]
    subject: Optional[str]
    message: str
    contact_reason: Optional[str]

# Projects endpoints
@app.get("/api/projects", response_model=List[Project])
async def get_projects(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured_only: bool = Query(False, description="Show only featured projects"),
    published_only: bool = Query(True, description="Show only published projects")
):
    """Récupérer les projets"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM projects WHERE 1=1"
        params = []
        param_count = 0

        if published_only:
            query += " AND is_published = TRUE"

        if featured_only:
            query += " AND is_featured = TRUE"

        if category:
            param_count += 1
            query += f" AND category = ${param_count}"
            params.append(category)

        query += " ORDER BY display_order ASC, project_date DESC"

        rows = await conn.fetch(query, *params)
        results = []
        for row in rows:
            result = dict(row)
            # Convert arrays to lists
            result['tags'] = list(result['tags']) if result['tags'] else []
            result['technologies'] = list(result['technologies']) if result['technologies'] else []
            # Parse JSONB
            if isinstance(result.get('metrics'), str):
                result['metrics'] = json.loads(result['metrics']) if result['metrics'] else {}
            results.append(Project(**result))
        return results
    finally:
        await conn.close()

@app.get("/api/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    """Récupérer un projet spécifique par slug"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            "SELECT * FROM projects WHERE slug = $1 AND is_published = TRUE",
            slug
        )
        if not row:
            raise HTTPException(status_code=404, detail="Project not found")

        result = dict(row)
        result['tags'] = list(result['tags']) if result['tags'] else []
        result['technologies'] = list(result['technologies']) if result['technologies'] else []
        if isinstance(result.get('metrics'), str):
            result['metrics'] = json.loads(result['metrics']) if result['metrics'] else {}
        return Project(**result)
    finally:
        await conn.close()

# Blog endpoints
@app.get("/api/blog", response_model=List[BlogPost])
async def get_blog_posts(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured_only: bool = Query(False, description="Show only featured posts"),
    published_only: bool = Query(True, description="Show only published posts"),
    limit: int = Query(10, ge=1, le=50, description="Number of posts to return")
):
    """Récupérer les articles de blog"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM blog_posts WHERE 1=1"
        params = []
        param_count = 0

        if published_only:
            query += " AND is_published = TRUE"

        if featured_only:
            query += " AND is_featured = TRUE"

        if category:
            param_count += 1
            query += f" AND category = ${param_count}"
            params.append(category)

        query += " ORDER BY published_at DESC NULLS LAST"
        param_count += 1
        query += f" LIMIT ${param_count}"
        params.append(limit)

        rows = await conn.fetch(query, *params)
        results = []
        for row in rows:
            result = dict(row)
            result['keywords'] = list(result['keywords']) if result['keywords'] else []
            result['tags'] = list(result['tags']) if result['tags'] else []
            results.append(BlogPost(**result))
        return results
    finally:
        await conn.close()

@app.get("/api/blog/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    """Récupérer un article de blog spécifique par slug"""
    conn = await get_db_connection()
    try:
        row = await conn.fetchrow(
            "SELECT * FROM blog_posts WHERE slug = $1 AND is_published = TRUE",
            slug
        )
        if not row:
            raise HTTPException(status_code=404, detail="Blog post not found")

        result = dict(row)
        result['keywords'] = list(result['keywords']) if result['keywords'] else []
        result['tags'] = list(result['tags']) if result['tags'] else []

        # Increment view count
        await conn.execute(
            "UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1",
            result['id']
        )

        return BlogPost(**result)
    finally:
        await conn.close()

# Testimonials endpoints
@app.get("/api/testimonials", response_model=List[Testimonial])
async def get_testimonials(
    featured_only: bool = Query(False, description="Show only featured testimonials"),
    published_only: bool = Query(True, description="Show only published testimonials")
):
    """Récupérer les témoignages"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM testimonials WHERE 1=1"

        if published_only:
            query += " AND is_published = TRUE"

        if featured_only:
            query += " AND is_featured = TRUE"

        query += " ORDER BY display_order ASC, date_given DESC NULLS LAST"

        rows = await conn.fetch(query)
        return [Testimonial(**dict(row)) for row in rows]
    finally:
        await conn.close()

# GitHub Stats endpoint
@app.get("/api/github-stats", response_model=GitHubStats)
async def get_github_stats(username: Optional[str] = None):
    """Récupérer les statistiques GitHub"""
    conn = await get_db_connection()
    try:
        if username:
            row = await conn.fetchrow(
                "SELECT * FROM github_stats WHERE username = $1 ORDER BY last_fetched_at DESC LIMIT 1",
                username
            )
        else:
            # Get the most recent stats (assuming single user portfolio)
            row = await conn.fetchrow(
                "SELECT * FROM github_stats ORDER BY last_fetched_at DESC LIMIT 1"
            )

        if not row:
            raise HTTPException(status_code=404, detail="GitHub stats not found")

        result = dict(row)
        # Parse JSONB
        if isinstance(result.get('languages'), str):
            result['languages'] = json.loads(result['languages']) if result['languages'] else {}
        if isinstance(result.get('top_repos'), str):
            result['top_repos'] = json.loads(result['top_repos']) if result['top_repos'] else []

        return GitHubStats(**result)
    finally:
        await conn.close()

# Contact form endpoint
@app.post("/api/contact")
async def submit_contact_form(submission: ContactSubmission):
    """Soumettre un formulaire de contact"""
    conn = await get_db_connection()
    try:
        result = await conn.fetchrow(
            """
            INSERT INTO contact_submissions (
                name, email, company, subject, message, contact_reason, status
            ) VALUES ($1, $2, $3, $4, $5, $6, 'new')
            RETURNING id, created_at
            """,
            submission.name,
            submission.email,
            submission.company,
            submission.subject,
            submission.message,
            submission.contact_reason
        )

        return {
            "success": True,
            "message": "Message envoyé avec succès!",
            "id": result['id'],
            "created_at": result['created_at']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit contact form: {str(e)}")
    finally:
        await conn.close()

# ==================== PHASE 3: DUAL MODE + ANALYTICS ENDPOINTS ====================

# Models for Phase 3
class PortfolioMode(BaseModel):
    id: int
    mode_key: str
    display_name: str
    description: Optional[str]
    icon: Optional[str]
    color_primary: Optional[str]
    is_default: bool
    is_active: bool
    settings: dict
    created_at: datetime
    updated_at: datetime

class ContentOverride(BaseModel):
    mode_key: str
    content_type: str
    content_id: Optional[int]
    override_field: str
    override_value: str

class AnalyticsEvent(BaseModel):
    session_id: str
    event_type: str
    event_category: Optional[str]
    event_label: Optional[str]
    event_value: Optional[int]
    portfolio_mode: Optional[str]
    page_url: Optional[str]
    referrer_url: Optional[str]
    target_type: Optional[str]
    target_id: Optional[int]
    metadata: Optional[dict]

class VisitorSession(BaseModel):
    landing_page: Optional[str]
    landing_mode: Optional[str]
    referrer_source: Optional[str]
    utm_source: Optional[str]
    utm_medium: Optional[str]
    utm_campaign: Optional[str]
    user_agent: Optional[str]
    device_type: Optional[str]
    browser: Optional[str]
    os: Optional[str]
    screen_resolution: Optional[str]
    ip_address: Optional[str]

# Portfolio modes endpoints
@app.get("/api/modes", response_model=List[PortfolioMode])
async def get_portfolio_modes(active_only: bool = Query(True, description="Show only active modes")):
    """Get available portfolio modes"""
    conn = await get_db_connection()
    try:
        query = "SELECT * FROM portfolio_modes"
        if active_only:
            query += " WHERE is_active = TRUE"
        query += " ORDER BY is_default DESC, mode_key"

        rows = await conn.fetch(query)
        results = []
        for row in rows:
            result = dict(row)
            if isinstance(result.get('settings'), str):
                result['settings'] = json.loads(result['settings']) if result['settings'] else {}
            results.append(PortfolioMode(**result))
        return results
    finally:
        await conn.close()

# Get content with mode overrides applied
@app.get("/api/content/{content_type}")
async def get_content_with_mode(
    content_type: str,
    mode: str = Query('cdi', description="Portfolio mode (cdi or freelance)"),
    content_id: Optional[int] = Query(None, description="Specific content ID")
):
    """Get content with mode-specific overrides applied"""
    conn = await get_db_connection()
    try:
        # Get overrides for this mode and content type
        override_query = """
            SELECT override_field, override_value
            FROM mode_content_overrides
            WHERE mode_key = $1 AND content_type = $2 AND is_active = TRUE
        """
        params = [mode, content_type]

        if content_id is not None:
            override_query += " AND content_id = $3"
            params.append(content_id)
        else:
            override_query += " AND content_id IS NULL"

        override_query += " ORDER BY priority DESC"

        overrides = await conn.fetch(override_query, *params)

        # Convert to dict
        override_dict = {row['override_field']: row['override_value'] for row in overrides}

        return {"mode": mode, "content_type": content_type, "overrides": override_dict}
    finally:
        await conn.close()

# Get projects with mode filtering
@app.get("/api/mode-projects", response_model=List[Project])
async def get_mode_projects(
    mode: str = Query('cdi', description="Portfolio mode"),
    featured_only: bool = Query(False, description="Featured only")
):
    """Get projects filtered and prioritized by mode"""
    conn = await get_db_connection()
    try:
        query = """
            SELECT *,
                   (mode_priority->>$1)::INTEGER as priority
            FROM projects
            WHERE is_published = TRUE
              AND $1 = ANY(target_modes)
        """
        params = [mode]

        if featured_only:
            query += " AND is_featured = TRUE"

        query += " ORDER BY priority DESC NULLS LAST, project_date DESC"

        rows = await conn.fetch(query, *params)
        results = []
        for row in rows:
            result = dict(row)
            result['tags'] = list(result['tags']) if result['tags'] else []
            result['technologies'] = list(result['technologies']) if result['technologies'] else []
            if isinstance(result.get('metrics'), str):
                result['metrics'] = json.loads(result['metrics']) if result['metrics'] else {}
            if isinstance(result.get('mode_priority'), str):
                result['mode_priority'] = json.loads(result['mode_priority']) if result['mode_priority'] else {}
            result.pop('priority', None)  # Remove temp priority field
            results.append(Project(**result))
        return results
    finally:
        await conn.close()

# Analytics endpoints
@app.post("/api/analytics/event")
async def track_analytics_event(event: AnalyticsEvent):
    """Track an analytics event"""
    conn = await get_db_connection()
    try:
        await conn.execute(
            """
            INSERT INTO analytics_events (
                session_id, event_type, event_category, event_label, event_value,
                portfolio_mode, page_url, referrer_url, target_type, target_id, metadata
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """,
            event.session_id,
            event.event_type,
            event.event_category,
            event.event_label,
            event.event_value,
            event.portfolio_mode,
            event.page_url,
            event.referrer_url,
            event.target_type,
            event.target_id,
            json.dumps(event.metadata) if event.metadata else None
        )
        return {"success": True, "message": "Event tracked"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track event: {str(e)}")
    finally:
        await conn.close()

@app.post("/api/analytics/session")
async def create_or_update_session(session: VisitorSession):
    """Create or update a visitor session"""
    conn = await get_db_connection()
    try:
        # Check if session exists (by some unique identifier - for now create new)
        result = await conn.fetchrow(
            """
            INSERT INTO visitor_sessions (
                landing_page, landing_mode, referrer_source,
                utm_source, utm_medium, utm_campaign,
                user_agent, device_type, browser, os, screen_resolution, ip_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id
            """,
            session.landing_page,
            session.landing_mode,
            session.referrer_source,
            session.utm_source,
            session.utm_medium,
            session.utm_campaign,
            session.user_agent,
            session.device_type,
            session.browser,
            session.os,
            session.screen_resolution,
            session.ip_address
        )
        return {"success": True, "session_id": str(result['id'])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")
    finally:
        await conn.close()

@app.patch("/api/analytics/session/{session_id}")
async def update_session_activity(session_id: str, updates: dict):
    """Update session activity (page views, projects viewed, etc.)"""
    conn = await get_db_connection()
    try:
        # Build dynamic update query
        set_clauses = []
        params = []
        param_count = 1

        for key, value in updates.items():
            if key in ['page_views', 'projects_viewed', 'blog_posts_viewed', 'mode_switches']:
                set_clauses.append(f"{key} = {key} + ${param_count}")
                params.append(value)
                param_count += 1
            elif key in ['contact_submitted', 'cv_downloaded']:
                set_clauses.append(f"{key} = ${param_count}")
                params.append(value)
                param_count += 1
            elif key == 'modes_viewed':
                # Append to array
                set_clauses.append(f"modes_viewed = array_append(modes_viewed, ${param_count})")
                params.append(value)
                param_count += 1

        if not set_clauses:
            return {"success": False, "message": "No valid updates provided"}

        set_clauses.append(f"last_seen_at = CURRENT_TIMESTAMP")
        params.append(session_id)

        query = f"""
            UPDATE visitor_sessions
            SET {', '.join(set_clauses)}
            WHERE id = ${param_count}
        """

        await conn.execute(query, *params)
        return {"success": True, "message": "Session updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update session: {str(e)}")
    finally:
        await conn.close()

# Analytics dashboard endpoints
@app.get("/api/analytics/summary")
async def get_analytics_summary(mode: Optional[str] = None, days: int = Query(7, ge=1, le=90)):
    """Get analytics summary for the last N days"""
    conn = await get_db_connection()
    try:
        query = """
            SELECT
                COUNT(DISTINCT session_id) as total_sessions,
                COUNT(*) as total_events,
                COUNT(DISTINCT CASE WHEN event_type = 'contact' THEN session_id END) as contacts,
                COUNT(DISTINCT CASE WHEN event_type = 'cv_download' THEN session_id END) as cv_downloads,
                AVG(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) as avg_page_views
            FROM analytics_events
            WHERE created_at >= CURRENT_DATE - INTERVAL '%s days'
        """ % days

        if mode:
            query += " AND portfolio_mode = $1"
            result = await conn.fetchrow(query, mode)
        else:
            result = await conn.fetchrow(query)

        return dict(result) if result else {}
    finally:
        await conn.close()

@app.get("/api/analytics/mode-comparison")
async def get_mode_comparison():
    """Get performance comparison between CDI and Freelance modes"""
    conn = await get_db_connection()
    try:
        rows = await conn.fetch("SELECT * FROM mode_performance_comparison")
        return [dict(row) for row in rows]
    finally:
        await conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)