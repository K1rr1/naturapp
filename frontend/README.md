## Backend och autentisering

Projektet innehåller en backend byggd med Express.

Nuvarande auth-flöde:
- användaren loggar in via `POST /dev/login`
- backend returnerar en JWT
- token sparas i frontend
- skyddad route `/dev/me` verifierar token via middleware

