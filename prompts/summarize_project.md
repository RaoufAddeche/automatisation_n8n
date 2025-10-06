# Prompt de Résumé de Projet

## Contexte
Tu analyses un repository GitHub pour créer un élément de portfolio professionnel.

## Données d'entrée

**Repository:** {{owner}}/{{repo}}
**Description GitHub:** {{description}}
**Langage principal:** {{language}}
**Stars:** {{stars}} | **Forks:** {{forks}}
**Dernière activité:** {{last_push}}

**README complet:**
```markdown
{{readme}}
```

## Ta mission

Analyse ce projet et génère un résumé portfolio professionnel qui met en valeur les compétences techniques et l'impact du développeur.

## Instructions spécifiques

1. **Titre** : Reformule le nom du projet pour qu'il soit professionnel et clair
2. **Pitch court** : Vends le projet en 2-3 phrases (style CV/LinkedIn)
3. **Description longue** : Structure en 4 parties :
   - **Contexte** : Pourquoi ce projet ?
   - **Objectifs** : Que cherchait-on à accomplir ?
   - **Approche** : Comment c'est fait techniquement ?
   - **Résultats** : Quel impact/apprentissage ?

4. **Tags** : Mots-clés pour le recrutement (évite le trop technique)
5. **Stack** : Technologies, frameworks, bibliothèques utilisées
6. **Impact** : Chiffre ou bénéfice concret si possible

## Exemples de formulations

✅ **Bon pitch :** "Application web de gestion de tâches développée en React, avec authentification JWT et API REST. Gère 100+ utilisateurs actifs avec temps de réponse < 200ms."

❌ **Mauvais pitch :** "Un autre todo app fait en React avec du JWT."

✅ **Bon impact :** "Amélioration de 40% de la productivité équipe, réduction temps de déploiement de 2h à 15min"

❌ **Mauvais impact :** "Ça marche bien et c'est rapide"

## Réponse attendue

JSON valide uniquement, sans markdown ni commentaires :

```json
{
  "title": "...",
  "short_pitch": "...",
  "long_desc": "...",
  "tags": ["..."],
  "stack": ["..."],
  "impact": "...",
  "confidence_score": 0.85
}
```