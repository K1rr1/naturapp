# Naturappen 🌱

Naturappen är en mobilanpassad webbapplikation där användare kan
rapportera miljöproblem på en karta, skapa städevent och delta i andras
insatser.

Syftet med applikationen är att skapa ett enklare sätt för
privatpersoner att bidra till en renare miljö genom samarbete och
synlighet.

## 🚀 Funktioner

###  Autentisering
- Registrering av användare
- Inloggning
- JWT-baserad session
- Gästinloggning

### 🗺️ Karta & rapporter
- Visa rapporter som pins på karta
- Skapa rapport genom att klicka på kartan
- Rapport innehåller:
  - position (lat/lng)
  - kategori
  - beskrivning
  - skapare
  - datum
  - status (öppen / åtgärdad)
- Markera rapport som åtgärdad

###  Event
- Skapa event kopplade till rapporter
- Gå med i event
- Lämna event

###  Profil
- Visa användarinfo
- Statistik (rapporter / event)
- Badge/level (grundstruktur)

###  Notiser
- Händelser kopplade till aktivitet i appen

###  Community
- Feed över aktivitet i appen

###  Filter
- Filtrera rapporter baserat på:
  - kategori
  - ägare
  - event
  - status (öppen / åtgärdad)

### Autentisering

-   Registrering
-   Inloggning
-   JWT-session
-   Gästinloggning

### Karta & rapporter

-   Skapa rapport via karta
-   Visa rapporter
-   Markera som åtgärdad

### Event

-   Skapa event
-   Gå med i event

### Profil

-   Visa användardata
-   Statistik

### Community & notiser

-   Feed
-   Notiser

## Teknik

Frontend: - React - TypeScript - Vite - Tailwind - React Leaflet

Backend: - Node.js - Express - JWT

## Starta projektet

Frontend: cd frontend npm install npm run dev

Backend: cd backend npm install npm run dev

## Avvikelse från PM

Projektet planerades i början med Supabase men det blev  Express och
JWT istället för att att förstå  backend, autentisering
och API-struktur bättre. Detta skulle jag nog säga var ett misstag för komm inte alls lika långt som tänkt.

Med det sakt tycker jag att jag uppfyller kursmålen , även om det blev tekniskt mer utmanande när jag bestämde mig för och göra egen backend. Kärnflödet funkar så tacka gudarna för det

## Begränsningar

-   Ingen databas (in-memory)
-   Ingen bild-upload
-   Begränsad event-logik




om eventuell bugg : 

localStorage.clear()

