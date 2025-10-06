import express from 'express';
import cors from 'cors';
import { listRepos, getReadme, getRepoDetails } from './github.js';
import { listTools, register, findTool } from './mcpTools.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Enregistrement des tools MCP-like pour GitHub
register({
  name: 'github.list_repos',
  description: 'Lister les repos publics du user avec tri par dernière activité',
  params: {},
  handler: async () => {
    const repos = await listRepos();
    return (repos as any[]).map((r: any) => ({
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      pushed_at: r.pushed_at,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      private: r.private
    }));
  }
});

register({
  name: 'github.read_readme',
  description: 'Lire le README brut d\'un repo',
  params: {
    owner: 'propriétaire du repo',
    repo: 'nom du repo'
  },
  handler: async ({ owner, repo }) => {
    const readme = await getReadme(owner, repo);
    return { owner, repo, readme };
  }
});

register({
  name: 'github.get_repo_details',
  description: 'Obtenir les détails complets d\'un repo',
  params: {
    owner: 'propriétaire du repo',
    repo: 'nom du repo'
  },
  handler: async ({ owner, repo }) => {
    const details = await getRepoDetails(owner, repo);
    return details;
  }
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Liste des tools disponibles
app.get('/mcp/tools', (_req, res) => {
  res.json({ tools: listTools() });
});

// Exécution d'un tool
app.post('/mcp/call', async (req, res) => {
  const { tool, args } = req.body || {};

  if (!tool) {
    return res.status(400).json({ error: 'tool parameter is required' });
  }

  try {
    const t = findTool(tool);
    if (!t) {
      return res.status(404).json({ error: 'unknown_tool', available_tools: listTools().map(t => t.name) });
    }

    const data = await t.handler(args || {});
    res.json({ ok: true, data });
  } catch (e: any) {
    console.error(`Error executing tool ${tool}:`, e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.SIDECAR_PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Sidecar MCP listening on port ${PORT}`);
  console.log(`📋 Available tools: ${listTools().map(t => t.name).join(', ')}`);
});