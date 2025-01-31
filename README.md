## Variables de entorno

```bash
cp .env.example .env.dev
cp .env.example .env.prod
```

```bash
nano .env.dev
nano .env.prod
```

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.dev.ts
```

```bash
nano src/environments/environment.ts
nano src/environments/environment.dev.ts
```

## Para desarrollo

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p neura_web_dev up --build
```

## Para produccion

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p neura_web_prod up -d --build
```
