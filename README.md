# Super Vidéothèque

Affichage simple de vidéos avec paiement.

## Démarrage

```bash
npm install
npm run dev
```

## Configuration

Copier `.env.example` vers `.env.local` et remplir les variables :

```bash
READ_ONLY_URL=https://read-only.vercel.app
READ_ONLY_SERVICE_KEY=your_key
PAYMENT_ONLY_URL=https://payment.onlymatt.ca
DEFAULT_PRODUCT_SLUG=super-videotheque
```

## Déploiement

```bash
vercel deploy
```

## Architecture

- **Landing page** → affiche les vidéos depuis read-only
- **Clic sur vidéo** → redirige vers payment-only pour paiement
- **Paiement validé** → accès au contenu

## Structure

```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Layout global
└── api/
    └── media/
        └── route.ts      # Proxy vers read-only

components/
├── MediaGrid.tsx         # Grille responsive
└── MediaCard.tsx         # Carte individuelle
```

## Fonctionnement

1. L'API `/api/media` récupère les vidéos depuis read-only (tag: super-videotheque)
2. La landing page affiche les vidéos dans une grille responsive
3. Clic sur une vidéo → redirige vers payment-only avec le product_slug (depuis les tags ou DEFAULT_PRODUCT_SLUG)
4. Après paiement, l'utilisateur est redirigé vers le contenu

## Tags des médias

Les médias peuvent avoir des tags pour contrôler le comportement :
- `product:slug` → spécifie le product_slug à utiliser pour le paiement
- Autres tags → affichés mais pas utilisés pour la logique

## Responsive

- Mobile : 1 colonne
- Tablette : 2 colonnes
- Desktop : 3-4 colonnes

## Prochaines étapes

- [ ] Ajouter un player vidéo après paiement
- [ ] Gérer les sessions utilisateur
- [ ] Ajouter des filtres par tag
- [ ] Live streaming (plus tard)
