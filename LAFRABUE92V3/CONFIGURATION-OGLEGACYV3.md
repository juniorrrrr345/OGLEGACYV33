# Configuration OGLEGACYV3 - Instructions Finales

## ✅ ÉTAPES DÉJÀ EFFECTUÉES

1. ✅ Projet cloné depuis LAFABRIQUE92V3
2. ✅ wrangler.toml configuré pour OGLEGACYV3
3. ✅ package.json mis à jour
4. ✅ Modaux corrigés (déjà en place)
5. ✅ Affichage mobile optimisé (2 colonnes)
6. ✅ Champs de commande ajoutés dans Settings.jsx
7. ✅ Fichiers SQL de données de base créés

## 🔧 ÉTAPES À EFFECTUER MANUELLEMENT

### 1. Créer le dépôt GitHub
```bash
# Aller sur GitHub.com et créer un nouveau repo
# Nom: OGLEGACYV3
# Public ou Private selon vos préférences
# NE PAS initialiser avec README
```

### 2. Configurer Git
```bash
cd /workspace/OGLEGACYV3/LAFRABUE92V3
git remote remove origin
git remote add origin https://github.com/juniorrrrr345/OGLEGACYV3.git
git add .
git commit -m "Configuration initiale OGLEGACYV3"
git push -u origin main
```

### 3. Créer les ressources Cloudflare

#### 3.1 Base de données D1
```bash
# Configurer le token Cloudflare d'abord
export CLOUDFLARE_API_TOKEN="votre_token_ici"

# Créer la base de données
wrangler d1 create oglegacy-db

# NOTER le database_id retourné et le mettre dans wrangler.toml
```

#### 3.2 Bucket R2
```bash
# Créer le bucket
wrangler r2 bucket create oglegacy-media

# Activer l'accès public
wrangler r2 bucket dev-url enable oglegacy-media

# NOTER l'URL retournée (ex: https://pub-xxxxxx.r2.dev)
```

### 4. Mettre à jour wrangler.toml
Remplacer dans wrangler.toml :
- `database_id = "VOTRE-DATABASE-ID"` par l'ID réel
- Mettre à jour l'URL R2 dans worker/index.js

### 5. Configurer les secrets
```bash
wrangler secret put DEFAULT_ADMIN_USERNAME
# Entrer: admin

wrangler secret put DEFAULT_ADMIN_PASSWORD  
# Entrer: MotDePasseFort123!
```

### 6. Déployer le Worker
```bash
wrangler deploy
```

### 7. Initialiser la base de données
```bash
# Remplacer par votre URL de worker
curl https://oglegacyv3.juniorrrrr345.workers.dev/api/init

# Importer les données de base
wrangler d1 execute oglegacy-db --file=./farms-oglegacy.sql --remote
wrangler d1 execute oglegacy-db --file=./categories-oglegacy.sql --remote
```

### 8. Déployer sur Vercel
1. Aller sur https://vercel.com/new
2. Importer le repo GitHub OGLEGACYV3
3. Configurer la variable d'environnement :
   - Name: VITE_API_URL
   - Value: https://oglegacyv3.juniorrrrr345.workers.dev
   - Environments: Production, Preview, Development
4. Déployer

## 🎯 URLS FINALES

- **Frontend**: https://oglegacyv3.vercel.app
- **Admin**: https://oglegacyv3.vercel.app/admin/login
- **Worker**: https://oglegacyv3.juniorrrrr345.workers.dev

## 🔑 Identifiants Admin

- **Username**: admin
- **Password**: MotDePasseFort123!

## ✅ CHECKLIST FINALE

- [ ] Dépôt GitHub créé
- [ ] Base de données D1 créée et initialisée
- [ ] Bucket R2 créé et rendu public
- [ ] wrangler.toml mis à jour avec les vrais IDs
- [ ] worker/index.js mis à jour avec la vraie URL R2
- [ ] Secrets configurés
- [ ] Worker déployé
- [ ] /api/init appelé avec succès
- [ ] Données de base importées
- [ ] Vercel configuré avec VITE_API_URL
- [ ] Site accessible et fonctionnel
- [ ] Admin accessible

## 🆘 Problèmes Courants

1. **"SyntaxError: Unexpected token '<'"**
   - Solution: Vérifier que VITE_API_URL est configurée sur Vercel

2. **"Products not found" / Page vide**
   - Solution: Appeler /api/init sur votre worker

3. **Images ne s'affichent pas**
   - Solution: Vérifier l'URL R2 dans worker/index.js

4. **"Database not found"**
   - Solution: Vérifier database_id dans wrangler.toml

## 📞 Support

Si vous rencontrez des problèmes, vérifiez cette checklist et consultez les logs :
- `wrangler tail` pour les logs du worker
- Console navigateur (F12) pour les erreurs frontend
