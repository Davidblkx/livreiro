FROM denoland/deno:1.29.4 as DENO_BUILD

WORKDIR /app

RUN cd /app
COPY . .
RUN mkdir -p ./dist

RUN cp -r ./public ./dist
RUN deno run -A bundle.ts ./dist/public/main.js
RUN deno bundle ./mod.ts -- ./dist/server.js

FROM denoland/deno:1.29.4 as Livreiro

ENV BUILD=__BUILD__

WORKDIR /app
USER deno

COPY --from=DENO_BUILD /app/dist /app
CMD ["run", "-A", "server.js"]
