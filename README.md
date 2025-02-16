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
yarn dev
```

Next app is served on [localhost:3000](http://localhost:3000/)
Nest app is served on [localhost:8000](http://localhost:8000/api)
