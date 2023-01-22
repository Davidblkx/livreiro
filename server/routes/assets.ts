import { RouteConfig } from './model.ts';
import { send } from 'oak';

export const registerAssetsRoute: RouteConfig = (config, _, app) => {
  app.use(async (ctx, next) => {
    if (ctx.request.url.pathname.startsWith('/assets/')) {
      const path = ctx.request.url.pathname.replace('/assets/', '');
      await send(ctx, path, {
        root: config.assetsPath,
        maxage: 1000 * 60 * 60 * 24,
      });
    }

    await next();
  });
};
