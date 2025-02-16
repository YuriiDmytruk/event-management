Event Management System (EMS)
Project Overview
A full-stack web application for managing and discovering events, built with modern web technologies.
Tech Stack

Frontend: Next.js 14, React, TypeScript
Backend: NestJS
Database: PostgreSQL
Styling: Material UI

Key Features

Create, read, update, and delete events
Event list with sorting and filtering
Detailed event views
Location-based event mapping
Event recommendation algorithm

Install globaly Turborepo
```sh
npm install -g turbo
```

Create in apps/web .env file

Then in root directory run
```sh
yarn install
```

Run DockerDesc and go to the docker directory
```sh
cd docker
```

Build Docker
```sh
docker-compose up -d
```

Go back to root and run monorepo
```sh
cd ..
```
```sh
yarn dev
```

Next app is served on [localhost:3000](http://localhost:3000/)
Nest app is served on [localhost:8000](http://localhost:8000/api)
