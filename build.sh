#!/bin/bash

rm -fr ./dist
mkdir -p ./dist

cp -r public ./dist

deno run -A bundle.ts ./dist/public/main.js
deno bundle ./mod.ts -- ./dist/server.js