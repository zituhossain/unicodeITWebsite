# Docker deployment

This project builds as a standalone Next.js app and runs inside Docker on port
3000.

## Local build check

```bash
docker compose build
docker compose up -d
```

Open `http://localhost:3000`.

## VPS deploy

From your machine:

```bash
scp -r . zitu@vmi3188005:~/projects/unicodeit
ssh zitu@vmi3188005
cd ~/projects/unicodeit
docker compose up -d --build
```

The app will be available on `http://vmi3188005:3000` unless you put Nginx or
another reverse proxy in front of it.

## Useful commands

```bash
docker compose logs -f web
docker compose restart web
docker compose down
```
