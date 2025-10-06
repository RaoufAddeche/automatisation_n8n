# ⚡ Quick Start n8n - 5 minutes

## 🎯 Import du Workflow Simplifié

### Étape 1 : Import

1. Ouvre http://localhost:5678
2. Login : `n8n_admin_user` / `O2ZkUw6Qjh5HCJT97mNWFgtzDaPv1LeA`
3. **Workflows** → **Import from File**
4. Sélectionne : `n8n/workflows/1_github_sync_simple.json`
5. Import ✅

### Étape 2 : Configure PostgreSQL (1 fois)

1. Ouvre le workflow
2. Clique sur le node **PostgreSQL: Insert**
3. **Credential to connect with** → **Create New**
4. Remplis :
   ```
   Name: Portfolio DB
   Host: postgresql
   Database: n8n_database
   User: admin_user_db
   Password: O2ZkUw6Qjh5HCJT97mNWFgtzDaPv1LeA
   Port: 5432
   SSL: Disabled
   ```
5. **Save**

### Étape 3 : Teste !

1. Clique **Execute Workflow** (bouton ⚡ en haut à droite)
2. Regarde les résultats dans chaque node :
   - **HTTP: Get GitHub Repos** → Liste tes repos
   - **Filter** → Repos avec stars
   - **HTTP: Get README** → Contenu README
   - **OpenAI: Generate Summary** → Résumé GPT
   - **PostgreSQL: Insert** → Insertion OK

### Étape 4 : Vérifie la base

```bash
docker exec postgresql psql -U admin_user_db -d n8n_database -c "SELECT title, category, github_stars FROM projects ORDER BY id DESC LIMIT 5;"
```

---

## 🔧 Configuration (Déjà Faite)

### ✅ Token GitHub
Déjà hardcodé dans le workflow : `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`

### ✅ Clé OpenAI
Déjà dans `.env` : `GPT_API_KEY`

### ✅ n8n redémarré
La variable d'environnement est chargée ✅

---

## 🐛 Dépannage Express

### Erreur OpenAI "Unauthorized"

**Fix** :
```bash
docker compose restart n8n
```

Puis dans le node **OpenAI: Generate Summary**, vérifie :
- Header `Authorization` = `Bearer {{ $env.GPT_API_KEY }}`

### Erreur PostgreSQL

**Fix** : Vérifie que :
- Host = `postgresql` (pas `localhost`)
- Port = `5432`
- Password correct

### Workflow ne s'exécute pas

**Fix** :
- Clique sur chaque node pour voir les erreurs en rouge
- Les nodes HTTP doivent avoir `typeVersion: 4`
- Les nodes Code doivent avoir `typeVersion: 2`

---

## ✅ C'est Tout !

Ton workflow devrait fonctionner maintenant.

**Résultats attendus** :
- Tes repos GitHub → Résumés GPT → Insérés en DB
- Vérifiable sur http://localhost:8000/api/projects

**Coût** : ~$0.01 par exécution (10 repos)
