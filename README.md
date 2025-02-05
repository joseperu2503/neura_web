## Variables de entorno

```bash
cp .env.example .env.dev
cp .env.example .env.prod
```

```bash
nano .env.dev
nano .env.prod
```

## Para desarrollo

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev -p neura_web_dev up --build
```

## Para produccion

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod -p neura_web_prod up -d --build
```
