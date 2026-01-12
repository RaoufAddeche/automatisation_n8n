# 🔄 Guide d'Import des Workflows n8n avec OpenAI

## 📋 Prérequis

- ✅ n8n actif : http://localhost:5678
- ✅ Clé API OpenAI configurée dans `.env`
- ✅ PostgreSQL actif avec les tables créées

---

## 🚀 Étape 1 : Connexion à n8n

1. Ouvre http://localhost:5678
2. Login :
   - **Username** : `n8n_admin_user`
   - **Password** : `O2ZkUw6Qjh5HCJT97mNWFgtzDaPv1LeA`

---

## 📥 Étape 2 : Importer le Workflow GitHub Sync

### Import du fichier

1. Dans n8n, clique sur **Workflows** (menu gauche)
2. Clique sur **Import from File**
3. Sélectionne : `n8n/workflows/1_github_portfolio_sync_openai.json`
4. Clique **Import**

---

## 🔑 Étape 3 : Configurer PostgreSQL Credential

### Créer le credential PostgreSQL

1. Ouvre le workflow importé
2. Clique sur le node **PostgreSQL: Upsert Project**
3. Dans "Credential to connect with" → **Create New**
4. Remplis les champs :

```
Name: Portfolio PostgreSQL
Host: postgresql
Database: n8n_database
User: admin_user_db
Password: O2ZkUw6Qjh5HCJT97mNWFgtzDaPv1LeA
Port: 5432
SSL: Disabled
```

5. Clique **Save**
6. Le credential sera automatiquement utilisé pour tous les nodes PostgreSQL

---

## 🔐 Étape 4 : Configurer GitHub OAuth2

### Option A : GitHub Personal Access Token (Recommandé)

1. Va sur https://github.com/settings/tokens
2. Clique **Generate new token (classic)**
3. Scopes à cocher :
   - ✅ `public_repo`
   - ✅ `read:user`
4. Copie le token généré

### Dans n8n :

1. Clique sur le node **GitHub: Get All Repos**
2. Dans "Credential to connect with" → **Create New**
3. Sélectionne **GitHub API** (pas OAuth2)
4. Remplis :
   - **Access Token** : Colle ton token GitHub
   - **User** : `RaoufAddeche`
5. **Save**

---

## 🤖 Étape 5 : Configurer l'API Key OpenAI dans n8n

### Vérifier que la clé est dans le .env

Ta clé est déjà dans `.env` :
```
GPT_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

### Restart n8n pour charger la variable

```bash
docker compose restart n8n
```

### Vérifier dans le node OpenAI

1. Ouvre le node **OpenAI: Generate Summary**
2. Vérifie les **Headers** :
   - Header `Authorization` = `Bearer {{ $env.GPT_API_KEY }}`
3. Vérifie le **Body (JSON)** :
   - Model = `gpt-4o-mini`

**Note** : Le node utilise `{{ $env.GPT_API_KEY }}` qui charge automatiquement la variable depuis le .env.

---

## ✅ Étape 6 : Tester le Workflow

### Test manuel

1. Dans n8n, ouvre le workflow **GitHub → Portfolio Sync (OpenAI)**
2. Clique sur **Execute Workflow** (bouton play ⚡ en haut à droite)
3. Le workflow va :
   - Récupérer tes repos GitHub
   - Filtrer ceux avec des stars
   - Lire les README
   - Envoyer à OpenAI pour génération résumé
   - Insérer dans PostgreSQL

### Vérifier les résultats

Dans chaque node, tu peux voir les données :
- **GitHub: Get All Repos** → Liste de tes repos
- **Filter** → Repos filtrés
- **HTTP: Get README** → Contenu README
- **OpenAI: Generate Summary** → Réponse GPT
- **PostgreSQL: Upsert Project** → Insertion confirmée

### Vérifier dans la base de données

```bash
docker exec postgresql psql -U admin_user_db -d n8n_database -c "SELECT title, category, github_stars FROM projects ORDER BY id DESC LIMIT 5;"
```

---

## 🔴 Dépannage

### Erreur "Unauthorized" OpenAI

**Problème** : La clé API n'est pas reconnue.

**Solution** :
1. Vérifie que la clé dans `.env` est correcte (commence par `sk-proj-`)
2. Restart n8n : `docker compose restart n8n`
3. Vérifie que le header Authorization est bien : `Bearer {{ $env.GPT_API_KEY }}`

### Erreur "GitHub API rate limit"

**Problème** : Trop de requêtes GitHub.

**Solution** :
1. Ajoute un token GitHub dans les credentials
2. Le rate limit passe de 60 req/h à 5000 req/h

### Erreur "PostgreSQL connection failed"

**Problème** : n8n ne peut pas se connecter à PostgreSQL.

**Solution** :
1. Vérifie que le host est `postgresql` (nom du service Docker)
2. Vérifie que le port est `5432`
3. Vérifie que le password est correct

### Le workflow ne se déclenche pas automatiquement

**Problème** : Le workflow n'est pas actif.

**Solution** :
1. Ouvre le workflow
2. Toggle **Active** en haut à droite (doit être vert)
3. Le workflow s'exécutera toutes les 6h

---

## 🎯 Prochaines Étapes

### Activer le workflow

1. Ouvre le workflow
2. Clique sur **Active** (toggle en haut à droite)
3. Le workflow s'exécutera automatiquement toutes les 6h

### Importer les autres workflows (optionnel)

- `2_visitor_notifications.json` : Notifications visiteurs
- `3_analytics_daily_digest.json` : Rapport analytics quotidien
- `4_content_review_alerts.json` : Alertes contenu à valider

---

## 💰 Coûts OpenAI (Estimation)

**GPT-4o-mini** :
- Input : $0.15 / 1M tokens
- Output : $0.60 / 1M tokens

**Pour 10 repos GitHub** :
- Lecture README : ~20,000 tokens input
- Génération résumés : ~5,000 tokens output
- **Coût total** : ~$0.006 (moins d'un centime)

**Par mois** (avec scan toutes les 6h) :
- 120 exécutions x 10 repos = 1,200 analyses
- **Coût total** : ~$0.72/mois

**Économique pour un portfolio automatisé !**

---

## 🚀 Félicitations !

Ton workflow GitHub → Portfolio est maintenant configuré avec OpenAI ! 🎉

**Teste-le** en cliquant sur **Execute Workflow**, puis vérifie les projets sur :
- API : http://localhost:8000/api/projects
- Frontend : http://localhost:3000
