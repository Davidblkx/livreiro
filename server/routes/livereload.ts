import { DEFAULT_ENDPOINT } from '../../www/live-reload/options.ts';
import { LIVE_RELOAD_SCRIPT } from '../template.ts';
import { RouteConfig } from './model.ts';

let reloadSockets: WebSocket[] = [];

export const registerLivereloadRoute: RouteConfig = (config, router) => {
  if (config.production) return;
  const base = import.meta.url.replace('routes/livereload.ts', '../public/live-reload.js');
  const fileContent = Deno.readTextFileSync(new URL(base));

  router.get(LIVE_RELOAD_SCRIPT, (ctx) => {
    ctx.response.body = fileContent;
    ctx.response.headers.set('Content-Type', 'application/javascript');
  });

  router.get(DEFAULT_ENDPOINT, (ctx) => {
    if (!ctx.isUpgradable) {
      ctx.throw(501);
    }

    const ws = ctx.upgrade();
    ws.onclose = () => {
      reloadSockets = reloadSockets.filter((s) => s !== ws);
    };

    reloadSockets.push(ws);
  });
};

export function clearReloadSockets() {
  reloadSockets.forEach((socket) => {
    try {
      socket.close();
    } catch { /* ignore */ }
  });
  reloadSockets = [];
}

export function sendReloadEvent() {
  reloadSockets.forEach((socket) => {
    socket.send(JSON.stringify({ type: 'reload' }));
  });
}
