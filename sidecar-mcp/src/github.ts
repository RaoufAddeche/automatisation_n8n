import fetch from 'node-fetch';

const GH = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN!;
const username = process.env.GITHUB_USERNAME!;

export async function listRepos() {
  if (!token || !username) {
    throw new Error('GITHUB_TOKEN and GITHUB_USERNAME must be set');
  }

  const res = await fetch(`${GH}/users/${username}/repos?per_page=100&sort=pushed`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'portfolio-assistant/1.0'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getReadme(owner: string, repo: string) {
  const res = await fetch(`${GH}/repos/${owner}/${repo}/readme`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw',
      'User-Agent': 'portfolio-assistant/1.0'
    }
  });

  if (res.status === 404) return '';
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

export async function getRepoDetails(owner: string, repo: string) {
  const res = await fetch(`${GH}/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'portfolio-assistant/1.0'
    }
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}