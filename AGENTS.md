# super-videotheque — AGENTS.md

## SYSTEM OVERVIEW

- **URL:** `video.onlymatt.ca` (à configurer)
- **Platform:** Vercel (Next.js 14+, TypeScript, Tailwind)
- **Role:** Affichage simple de vidéos avec paiement
- **DB:** Aucune DB propre — utilise read-only et payment-only

---

## ARCHITECTURE

### Flux simplifié
```
1. Landing page → affiche les vidéos depuis read-only
2. Clic sur une vidéo → redirige vers payment-only
3. Paiement validé → accès au contenu
```

### Sources de données
- **read-only** → récupère les médias (tag: super-videotheque)
- **payment-only** → gère les paiements et accès

---

## STRUCTURE

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

---

## VARIABLES D'ENVIRONNEMENT

| Variable | Description |
|---|---|
| `READ_ONLY_URL` | URL de l'API read-only |
| `READ_ONLY_SERVICE_KEY` | Clé d'auth pour read-only |
| `PAYMENT_ONLY_URL` | URL de payment-only |
| `DEFAULT_PRODUCT_SLUG` | Slug par défaut si pas de tag product: |

---

## RÈGLES

### RULE 1 — SIMPLICITÉ
Pas de logique complexe. Affichage + paiement. C'est tout.

### RULE 2 — TAG-BASED
Les médias viennent avec leurs tags. Pas de logique métier ici.

### RULE 3 — RESPONSIVE
Mobile-first. Tout doit fonctionner parfaitement sur mobile.

---

## NEVER DO

- Ajouter une DB locale
- Complexifier le flow
- Ajouter des fonctionnalités non demandées
- Stocker des données localement
