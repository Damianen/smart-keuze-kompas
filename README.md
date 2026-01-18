# Smart Keuze Kompas

## Overzicht

Smart Keuze Kompas is een intelligente applicatie die studenten helpt bij het kiezen van de juiste keuzemodule. Door middel van AI genereert de applicatie gepersonaliseerde module-aanbevelingen op basis van de interesses, voorkeuren en input van de student.

## Architectuur

Het project bestaat uit drie hoofdcomponenten:

### 1. **FastAPI** (Python API)
De FastAPI backend biedt een AI-aangedreven aanbevelingssysteem dat op basis van studentinput relevante keuzemodules voorstelt.

**Belangrijkste technologieën:**
- FastAPI 0.104.1
- Uvicorn (ASGI server)
- Scikit-learn
- Pandas & NumPy (Data processing)
- Pydantic (Data validatie)

### 2. **NestJS API** (Node.js/TypeScript - Backend API)
De NestJS backend verzorgt de hoofdapplicatielogica, authenticatie en dataopslag.

**Belangrijkste technologieën:**
- NestJS 11
- MongoDB (Database)
- JWT Authentication
- bcrypt (Password hashing)
- Winston (Logging)

### 3. **Angular Webapp** (TypeScript - Frontend)
De Angular webapp is de gebruikersinterface van de applicatie met moderne UI/UX.

**Belangrijkste technologieën:**
- Angular 21
- TailwindCSS 4
- Server-Side Rendering (SSR)
- RxJS
- Cypress (Testing)

## Lokaal opstarten

### Vereisten
- Node.js (v20 of hoger)
- Python 3.x
- npm 11.6.4 of hoger

### 1. FastAPI (API)

```bash
# Navigeer naar de FastAPI directory
cd FastAPI

# Maak een virtuele omgeving aan (optioneel maar aanbevolen)
python -m venv venv
source venv/bin/activate  # Op Windows: venv\Scripts\activate

# Installeer dependencies
pip install -r requirements.txt

# Configureer environment variables
# Maak een .env bestand aan met:
# API_TOKEN=your_secret_token

# Start de server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

De FastAPI server draait nu op `http://localhost:8000`

### 2. NestJS API (Backend)

```bash
# Navigeer naar de api directory
cd api

# Installeer dependencies
npm install

# Configureer environment variables in .env bestand
# Zie .env.example voor vereiste variabelen

# Start de development server
npm run start:dev
```

De NestJS API draait nu op `http://localhost:3000` (standaard)

### 3. Angular Webapp (Frontend)

```bash
# Navigeer naar de webapp directory
cd webapp

# Installeer dependencies
npm install

# Start de development server
npm start
```

De Angular applicatie draait nu op `http://localhost:4200`

## Testen

### Webapp (Cypress)
```bash
cd webapp
npm run cypress:open  # Interactieve test runner
npm test             # Headless tests
```

### API (Jest)
```bash
cd api
npm test              # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Met coverage report
```

## Licentie

MIT License - zie [LICENSE](LICENSE) voor details.
