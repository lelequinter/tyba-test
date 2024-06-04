# Near restaurants API

## Features:
- Login / Sign-up / logout
- Obtain near restaurant giving latitude and longitude or city
- Record history of all searches made by each user with their results (registred users)
- Obtain the history of searches made by the user (registred users)
## Technologies
- NodeJS with TypeScript
- PostgreSQL with sequelize
- Jest/supertest for testing
- Docker
## Run App
Run `npm run start`, the API will listen on port 3000
## Endpoints
- `/users` For users list
- `/users/:userId` For a specific user
- `/users` For create specific user
- `/users/:userId` For delete a user
- `/users/:userId` For update a user
- `/users/login` For user login
- `/users/logout` For user logout
- `/restaurants` For get nearby restaurants
- `/restaurants/history` For get nearby restaurants history
