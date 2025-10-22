# E-Commerce Store

Une boutique e-commerce moderne construite avec React, Vite, Tailwind CSS et Cloudflare Workers.

## 🚀 Fonctionnalités

- **Interface moderne** : Design responsive avec Tailwind CSS et Framer Motion
- **Administration complète** : Gestion des produits, catégories, fermes, utilisateurs
- **Stockage cloud** : Cloudflare R2 pour les médias, D1 pour la base de données
- **Performance optimale** : Déploiement sur Cloudflare Workers et Vercel
- **Mobile-first** : Interface optimisée pour tous les appareils

## 🛠️ Technologies

- **Frontend** : React 18, Vite, Tailwind CSS, Framer Motion
- **Backend** : Cloudflare Workers
- **Base de données** : Cloudflare D1 (SQLite)
- **Stockage** : Cloudflare R2
- **Déploiement** : Vercel (frontend) + Cloudflare (backend)

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd ecommerce-store
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Modifier .env avec votre URL d'API
   ```

4. **Lancer en développement**
   ```bash
   npm run dev
   ```

## ☁️ Configuration Cloudflare

### 1. Créer la base de données D1

```bash
wrangler d1 create votre-db-name
```

### 2. Créer le bucket R2

```bash
wrangler r2 bucket create votre-bucket-name
wrangler r2 bucket dev-url enable votre-bucket-name
```

### 3. Configurer wrangler.toml

```toml
name = "votre-worker"
main = "worker/index.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "votre-db-name"
database_id = "votre-database-id"

[[r2_buckets]]
binding = "R2"
bucket_name = "votre-bucket-name"
```

### 4. Initialiser la base de données

```bash
wrangler d1 execute votre-db-name --file=./worker/schema.sql --remote
```

### 5. Configurer les secrets

```bash
wrangler secret put DEFAULT_ADMIN_USERNAME
wrangler secret put DEFAULT_ADMIN_PASSWORD
```

### 6. Déployer le Worker

```bash
wrangler deploy
```

### 7. Initialiser les données

```bash
curl https://votre-worker.workers.dev/api/init
```

## 🌐 Déploiement Vercel

1. **Connecter le repo sur Vercel**
2. **Configurer la variable d'environnement**
   - `VITE_API_URL` : URL de votre Worker Cloudflare
3. **Déployer**

## 👤 Accès Admin

- URL : `/admin/login`
- Identifiants par défaut : `admin` / `admin123`

## 📱 Corrections Mobile Appliquées

- ✅ Modaux corrigés (affichage complet)
- ✅ Grille produits : 2 colonnes sur mobile
- ✅ Position des questionnaires optimisée
- ✅ Navigation responsive

## 🔧 Structure du Projet

```
├── src/
│   ├── components/          # Composants réutilisables
│   ├── pages/              # Pages principales
│   │   ├── admin/          # Pages d'administration
│   │   ├── Home.jsx        # Page d'accueil
│   │   ├── Products.jsx    # Catalogue produits
│   │   └── ProductDetail.jsx
│   ├── hooks/              # Hooks personnalisés
│   └── utils/              # Utilitaires
├── worker/                 # Cloudflare Worker
│   ├── index.js           # API principale
│   └── schema.sql         # Schéma de base de données
├── public/                # Assets statiques
└── docs/                  # Documentation
```

## 🎯 API Endpoints

- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/categories` - Liste des catégories
- `GET /api/farms` - Liste des fermes
- `GET /api/settings` - Paramètres de la boutique
- `POST /api/login` - Connexion admin
- `POST /api/upload` - Upload de fichiers

## 🔒 Sécurité

- Authentification simple par token
- Validation des données côté serveur
- CORS configuré
- Variables d'environnement sécurisées

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs : `wrangler tail`
2. Consultez la console navigateur (F12)
3. Vérifiez la configuration des variables d'environnement

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.