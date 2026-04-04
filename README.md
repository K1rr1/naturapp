# 🌱 Naturappen

En mobilanpassad webbapp där användare kan rapportera miljöproblem, skapa städevent och delta i gemensamma insatser.

---

## 🚀 Demo

> Lokal demo via `npm run dev`

---

## ✨ Funktioner

- 📍 Rapportera problem direkt på kartan
- 📅 Skapa städevent kopplade till rapporter
- 🙋 Gå med i event
- 🧭 Filtrera rapporter och event
- 👤 Profil med statistik, badges och aktivitet
- 🏆 Progression baserat på aktivitet
- ✨ Onboarding + splashscreen

---

## 🛠️ Teknik

| Teknologi | Beskrivning |
|----------|------------|
| React + TypeScript | Frontend |
| Vite | Build tool |
| React Leaflet | Kartfunktionalitet |
| Tailwind CSS | Styling |
| LocalStorage | Temporär datalagring |

---
### 🔜 Kommande teknik (under utveckling)

| Teknologi | Syfte |
|----------|------|
| Node.js + Express | Backend API |
| JWT (JSON Web Tokens) | Autentisering |
| AWS (Lambda / API Gateway) | Hosting av backend |
| DynamoDB / Databas | Lagring av användare, rapporter och event |
| Supabase (alternativ) | Databas + auth (utvärderas) |

## ▶️ Så startar du appen



```bash
git clone https://github.com/K1rr1/naturapp.git

cd naturapp

2. Installera dependencies
npm install

3. Starta appen
npm run dev

4. Öppna i webbläsaren
http://localhost:5173

🔐 Testinloggning
Användarnamn: user-456
Lösenord: mypassword123

eller:

Fortsätt som gäst


om eventuell bugg : 

localStorage.clear()