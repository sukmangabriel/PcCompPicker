# PcCompPicker

Interaktivna web aplikacija za konfiguriranje racunala i provjeru kompatibilnosti komponenti.

## Tehnologije

- Frontend: React 19, TypeScript 6, Vite 8, React Router, Axios, React Hot Toast
- Backend: Node.js, Express, TypeScript, PostgreSQL, JWT

## Preduvjeti

- Node.js: preporuka 22 LTS (minimalno 20+)
- npm: 10+
- PostgreSQL: 14+ (ili noviji)

## Struktura projekta

- frontend: korisnicko sucelje i konfigurator
- backend: API za autentifikaciju i spremanje konfiguracija

## Instalacija

Iz root-a projekta:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

## Varijable okruzenja

### Backend

PORT=3001
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
JWT_SECRET=promijeni-ovaj-kljuc

### Frontend

VITE_API_URL=http://localhost:3002/api

## Pokretanje aplikacije

### Pokretanje frontend + backend zajedno (iz root-a)

```bash
npm run dev
```

### Pokretanje odvojeno

Backend:

```bash
npm --prefix backend run dev
```

Frontend:

```bash
npm --prefix frontend run dev
```

## Validacija i kvaliteta koda

Formatiranje svih datoteka u root-u:

```bash
npx prettier --write .
```

Frontend lint:

```bash
npm --prefix frontend run lint
```

Frontend TypeScript validacija:

```bash
npm --prefix frontend run typecheck
```

Backend TypeScript validacija:

```bash
npm --prefix backend run build
```

## Produkcijski build

Frontend:

```bash
npm --prefix frontend run build
```

Backend:

```bash
npm --prefix backend run build
```
