import { RouteConfig } from './model.ts';
import { join } from 'deno/path/mod.ts';

type CacheType = 'script' | 'styles' | 'theme_dark' | 'theme_light';
const cacheSources = new Map<CacheType, string>();
const cacheNames: Record<CacheType, string> = {
  script: '/main.js',
  styles: '/styles.css',
  theme_dark: '/theme_dark.css',
  theme_light: '/theme_light.css',
};
const cacheFileType: Record<CacheType, string> = {
  script: 'application/javascript',
  styles: 'text/css',
  theme_dark: 'text/css',
  theme_light: 'text/css',
};

export const registerFrontendRoute: RouteConfig = (config, router) => {
  router.get('/endpoints', (ctx) => {
    const endpoints = Object.values(cacheNames);
    ctx.response.body = config.production ? endpoints.map((e) => e + '?v=' + config.build) : endpoints;
    ctx.response.headers.set('Content-Type', 'application/json');
  });

  let template = config.indexTemplate;
  if (config.production) {
    Object.values(cacheNames).forEach((name) => {
      template = template.replace(name, name + '?v=' + config.build);
    });
  }

  router.get('/', (ctx) => {
    ctx.response.body = template;
    ctx.response.headers.set('Content-Type', 'text/html');
  });

  router.get('/index.html', (ctx) => {
    ctx.response.body = template;
    ctx.response.headers.set('Content-Type', 'text/html');
  });

  if (!config.production) {
    return;
  }

  for (const type of Object.keys(cacheNames) as CacheType[]) {
    cacheSources.set(type, loadPublicFile(config.assetsPath, type));

    const routeName = cacheNames[type];
    const maxAge = 60 * 60 * 24;
    router.get(routeName, (ctx) => {
      ctx.response.body = cacheSources.get(type);
      ctx.response.headers.set('Content-Type', cacheFileType[type]);
      ctx.response.headers.set('Cache-Control', `public, max-age=${maxAge}`);
    });
  }
};

function loadPublicFile(root: string, type: CacheType) {
  const path = join(Deno.cwd(), root, cacheNames[type]);
  console.warn('Loading file', path);
  return Deno.readTextFileSync(path);
}
