# Oppsett av miljø

## Forutsetninger

- **Node.js**: 18.x - 20.x
- **npm**: 9.0.0+
- **PostgreSQL**: 16+

## Installasjoner

```bash
npm install
```

## Miljøvariabler

1. Kopier `.env.example` til `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fyll inn verdiene i `.env`:
   - `DATABASE_URL`: Din PostgreSQL-tilkobling
   - `PORT`: Port for serveren (standard: 5000)

## Utvikling

Start både klient og server:

```bash
npm run dev
```

Dette kjører `NODE_ENV=development tsx server/index.ts` som starter Express-serveren med Vite dev-server integrert.

## Bygging

```bash
npm run build
```

Genererer produksjonsbygningen i `dist/`.

## Produksjon

```bash
npm run start
```

Kjører den ferdigbygde applikasjonen med `NODE_ENV=production`.

## Database

```bash
npm run db:push
```

Pusher databaseskjemaet (fra `shared/schema.ts`) til PostgreSQL.

## Notat om Replit

Denne prosjektet ble ursprunglig satt opp i Replit. Følgende er ryddet opp:

- ✅ Fjernet Replit-spesifikke Vite-plugins
- ✅ Fjernet avhengighet av Replit-miljøvariabler (`REPLIT_INTERNAL_APP_DOMAIN`, etc.)
- ✅ Lagt til eksplisitt port-konfiguering
- ✅ Lagt til node-versjonslåsing
- ✅ Standardisert miljøvariabler med `.env`-fil

Filen `.replit` kan ligge der men påvirker ikke bygget lokalt eller i GitHub Actions.
