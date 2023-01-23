# Livreiro

Codigo fonte para o site [livreiro.pt](https://livreiro.pt)

## Instalação

### Requisitos

- [Deno](https://deno.land/)
- [git](https://git-scm.com/)

### Correr o site

- `git clone https://github.com/Davidblkx/livreiro.git`
- `cd livreiro`
- `deno run -A ./dev.ts`
- Abrir o website em `http://localhost:8666`

## Docker

- `docker run -p 8080:8080 -d ghcr.io/davidblkx/livreiro:latest`

### Usar REDIS cache

- `docker run --name redis p 6379:6379  -d redis`
- `docker run -p 8080:8080 -e CACHE=redis -e REDIS_URL=redis://redis:6379 ghcr.io/davidblkx/livreiro:latest`
